import { redirect } from 'next/navigation';

export const metadata = {
    title: "Digital Clean Up Day | Unlock My Data",
    description: "Faites le tri dans vos données pour en reprendre le contrôle et réduire votre empreinte numérique.",
};

export default function DigitalCleanUpPageFr() {
    redirect('/digital-clean-up');
}
