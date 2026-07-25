const fs = require('fs');
const path = require('path');

const historyPath = path.join(__dirname, '../public/data/contributions-history.json');
const manualDataPath = path.join(__dirname, '../public/data/manual');
const reviewsPath = path.join(__dirname, '../public/data/reviews.json');
const outputPath = path.join(__dirname, '../public/data/contributors-stats.json');

function addSidecarReviewers(reviewerStats, reviewsDir, serviceNames) {
  let files = [];
  try { files = fs.readdirSync(reviewsDir).filter((f) => f.endsWith('.json')); } catch { return; }
  files.forEach((file) => {
    let side; try { side = JSON.parse(fs.readFileSync(path.join(reviewsDir, file), 'utf8')); } catch { return; }
    const slug = file.replace('.json', '');
    const serviceName = serviceNames[slug] || slug;
    (side.reviewers || []).forEach((r) => {
      const nm = r.name;
      if (!nm) return;
      if (!reviewerStats[nm]) reviewerStats[nm] = { name: nm, count: 0, companies: [] };
      reviewerStats[nm].count++;
      reviewerStats[nm].companies.push({ name: serviceName, date: r.date });
    });
  });
}

function analyzeContributors() {
  // Load contributions history
  let history;
  try {
    history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
  } catch (error) {
    console.error('Error loading contributions-history.json:', error.message);
    console.log('Falling back to manual files analysis...');
    return analyzeFromManualFiles();
  }

  // Load reviews data
  let reviewsData = [];
  try {
    reviewsData = JSON.parse(fs.readFileSync(reviewsPath, 'utf8'));
  } catch (error) {
    console.error('Error loading reviews.json:', error.message);
  }

  const creatorStats = {};
  const updaterStats = {};
  const reviewerStats = {};
  const revieweeStats = {};
  const allContributions = [];

  // Load service names from manual files for display
  const serviceNames = {};
  const files = fs.readdirSync(manualDataPath).filter(file => file.endsWith('.json') && file !== 'slugs.json');
  files.forEach(file => {
    try {
      const filePath = path.join(manualDataPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const slug = file.replace('.json', '');
      serviceNames[slug] = data.name || slug;
    } catch (error) {
      // Ignore errors
    }
  });

  // Process reviews to gather reviewer and reviewee stats
  reviewsData.forEach(service => {
    const creator = service.created_by;
    const serviceName = service.name;

    if (creator && service.review && service.review.length > 0) {
      // Track reviews received by creator
      if (!revieweeStats[creator]) {
        revieweeStats[creator] = 0;
      }
      revieweeStats[creator] += service.review.length;

      // Track reviewer stats
      service.review.forEach(review => {
        const reviewerName = review.reviewer_name || review.reviewer;
        if (reviewerName) {
          if (!reviewerStats[reviewerName]) {
            reviewerStats[reviewerName] = {
              name: reviewerName,
              count: 0,
              companies: []
            };
          }
          reviewerStats[reviewerName].count++;
          reviewerStats[reviewerName].companies.push({
            name: serviceName,
            date: review.timestamp || service.created_at
          });
        }
      });
    }
  });

  addSidecarReviewers(reviewerStats, path.join(__dirname, '../public/data/policy-analysis/reviews'), serviceNames);

  // Process contributions from history
  for (const [slug, contributions] of Object.entries(history.contributions)) {
    const serviceName = serviceNames[slug] || slug;

    contributions.forEach((contribution, index) => {
      const { author, date, type } = contribution;

      if (type === 'create') {
        // Track creators
        if (!creatorStats[author]) {
          creatorStats[author] = {
            name: author,
            count: 0,
            companies: []
          };
        }
        creatorStats[author].count++;
        creatorStats[author].companies.push({
          name: serviceName,
          date: date
        });
      } else if (type === 'update') {
        // Track updaters - count each update
        if (!updaterStats[author]) {
          updaterStats[author] = {
            name: author,
            count: 0,
            companies: []
          };
        }
        updaterStats[author].count++;
        updaterStats[author].companies.push({
          name: serviceName,
          date: date
        });
      }
    });

    // Build allContributions for compatibility
    const createEntry = contributions.find(c => c.type === 'create');
    const lastUpdate = [...contributions].reverse().find(c => c.type === 'update');

    allContributions.push({
      company: serviceName,
      createdBy: createEntry?.author || 'Unknown',
      createdAt: createEntry?.date || '',
      updatedBy: lastUpdate?.author || createEntry?.author || 'Unknown',
      updatedAt: lastUpdate?.date || '',
      totalContributions: contributions.length,
      allContributors: [...new Set(contributions.map(c => c.author))]
    });
  }

  // Calculate Autonomy Score and Suggested Points for creators
  const enhancedCreators = Object.values(creatorStats).map(creator => {
    const reviewsReceived = revieweeStats[creator.name] || 0;
    
    // Points calculation: 10 points per creation, -2 per review requested. Min 2 points per creation.
    const basePoints = creator.count * 10;
    const penalty = reviewsReceived * 2;
    const rawPoints = basePoints - penalty;
    const minPoints = creator.count * 2; // Floor to guarantee some reward
    const suggestedPoints = Math.max(rawPoints, minPoints);

    // Autonomy calculation: Percentage of points retained
    let autonomyScore = 100;
    if (basePoints > 0) {
      autonomyScore = Math.max(20, Math.round((suggestedPoints / basePoints) * 100));
    }

    return {
      ...creator,
      reviewsReceived,
      autonomyScore,
      suggestedPoints
    };
  });

  // Calculate points for updaters and reviewers
  const enhancedUpdaters = Object.values(updaterStats).map(updater => {
    return {
      ...updater,
      suggestedPoints: updater.count * 3 // 3 points per update
    };
  });

  const enhancedReviewers = Object.values(reviewerStats).map(reviewer => {
    return {
      ...reviewer,
      suggestedPoints: reviewer.count * 5 // 5 points per review action
    };
  });

  // Sort by count
  const topCreators = enhancedCreators.sort((a, b) => b.count - a.count);
  const topUpdaters = enhancedUpdaters.sort((a, b) => b.count - a.count);
  const topReviewers = enhancedReviewers.sort((a, b) => b.count - a.count);

  // Calculate total unique contributors
  const allAuthors = new Set();
  Object.values(history.contributions).forEach(contributions => {
    contributions.forEach(c => allAuthors.add(c.author));
  });
  Object.keys(reviewerStats).forEach(author => allAuthors.add(author)); // Add reviewers just in case

  const stats = {
    totalFiles: Object.keys(history.contributions).length,
    totalContributions: Object.values(history.contributions).flat().length,
    uniqueContributors: allAuthors.size,
    topCreators,
    topUpdaters,
    topReviewers,
    allContributions,
    generatedAt: new Date().toISOString(),
    sourceVersion: history.version
  };

  fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

  console.log('\n📊 Contributor Statistics Generated from History!\n');
  console.log(`Total services: ${stats.totalFiles}`);
  console.log(`Total contributions: ${stats.totalContributions}`);
  console.log(`Unique contributors: ${stats.uniqueContributors}`);
  
  console.log(`\n🏆 Top Creators:`);
  topCreators.slice(0, 5).forEach((creator, index) => {
    console.log(`  ${index + 1}. ${creator.name}: ${creator.count} fiches (Autonomy: ${creator.autonomyScore}%, Points: ${creator.suggestedPoints})`);
  });
  
  console.log(`\n🔄 Top Updaters:`);
  topUpdaters.slice(0, 5).forEach((updater, index) => {
    console.log(`  ${index + 1}. ${updater.name}: ${updater.count} mises à jour (Points: ${updater.suggestedPoints})`);
  });

  console.log(`\n⭐ Top Reviewers:`);
  topReviewers.slice(0, 5).forEach((reviewer, index) => {
    console.log(`  ${index + 1}. ${reviewer.name}: ${reviewer.count} relectures (Points: ${reviewer.suggestedPoints})`);
  });

  console.log(`\n✅ Stats saved to: ${outputPath}\n`);
}

// Fallback function using manual files (legacy)
function analyzeFromManualFiles() {
  const files = fs.readdirSync(manualDataPath).filter(file => file.endsWith('.json') && file !== 'slugs.json');

  const creatorStats = {};
  const updaterStats = {};
  const allContributions = [];

  files.forEach(file => {
    try {
      const filePath = path.join(manualDataPath, file);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      const createdBy = data.created_by || 'Unknown';
      const updatedBy = data.updated_by || data.created_by || 'Unknown';
      const createdAt = data.created_at || '';
      const updatedAt = data.updated_at || '';

      // Track creators
      if (!creatorStats[createdBy]) {
        creatorStats[createdBy] = {
          name: createdBy,
          count: 0,
          companies: []
        };
      }
      creatorStats[createdBy].count++;
      creatorStats[createdBy].companies.push({
        name: data.name,
        date: createdAt
      });

      // Track updaters (only if different from creator or has update date)
      if (updatedAt && updatedAt !== createdAt) {
        if (!updaterStats[updatedBy]) {
          updaterStats[updatedBy] = {
            name: updatedBy,
            count: 0,
            companies: []
          };
        }
        updaterStats[updatedBy].count++;
        updaterStats[updatedBy].companies.push({
          name: data.name,
          date: updatedAt
        });
      }

      allContributions.push({
        company: data.name,
        createdBy: createdBy,
        createdAt: createdAt,
        updatedBy: updatedBy,
        updatedAt: updatedAt
      });

    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });

  const topCreators = Object.values(creatorStats).sort((a, b) => b.count - a.count);
  const topUpdaters = Object.values(updaterStats).sort((a, b) => b.count - a.count);

  const stats = {
    totalFiles: files.length,
    topCreators,
    topUpdaters,
    topReviewers: [], // Add empty for frontend compatibility
    allContributions,
    generatedAt: new Date().toISOString()
  };

  fs.writeFileSync(outputPath, JSON.stringify(stats, null, 2));

  console.log('\n📊 Contributor Statistics Generated (Legacy Mode)!\n');
  console.log(`Total files analyzed: ${files.length}`);
  console.log(`\n✅ Stats saved to: ${outputPath}\n`);
}

if (require.main === module) analyzeContributors();

module.exports = { analyzeContributors, addSidecarReviewers };
