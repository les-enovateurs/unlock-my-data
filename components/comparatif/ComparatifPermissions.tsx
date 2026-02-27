import Image from "next/image";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { Service, Permission, AppPermissions } from "./types";
import Translator from "@/components/tools/t";

interface ComparatifPermissionsProps {
    selectedServices: Service[];
    permissions: { [key: string]: AppPermissions };
    dangerousPermissionsList: Permission[];
    dangerousCounts: { slug: string; name: string; count: number | null }[];
    capitalizeFirstLetter: (val: string) => string;
    t: Translator;
}

export default function ComparatifPermissions({
    selectedServices,
    permissions,
    dangerousPermissionsList,
    dangerousCounts,
    capitalizeFirstLetter,
    t
}: ComparatifPermissionsProps) {
    if (Object.keys(permissions).length === 0) return null;

    return (
        <section id="permissions" className="p-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="w-full border-collapse bg-white text-sm">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="p-4 text-left font-semibold text-gray-900 border-b border-gray-200 w-1/3">
                                <div className="flex items-center">
                                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-600" />
                                    {t.t('sensitivePermissionsTitle')}
                                </div>
                                <p className="text-xs text-gray-500 font-normal mt-1">{t.t('sensitivePermissionsDesc')}</p>
                            </th>
                            {selectedServices.map((service) => (
                                <th key={service.slug}
                                    className="p-4 text-center border-b border-gray-200 min-w-[140px]">
                                    <div className="flex flex-col items-center">
                                        <div className="relative w-8 h-8 mb-2">
                                            <Image
                                                src={service.logo}
                                                alt={service.name}
                                                fill
                                                className="object-contain"
                                            />
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">{service.name}</span>
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        <tr className="bg-red-50">
                            <td className="p-4 font-bold text-red-800">
                                {t.t('totalDangerousPermissions')}
                            </td>
                            {dangerousCounts.map(({ slug, count }) => (
                                <td key={slug}
                                    className={`p-4 text-center font-bold text-lg ${count === null ? "text-gray-400" : count > 0 ? "text-red-600" : "text-green-600"}`}>
                                    {count === null ? "?" : count}
                                </td>
                            ))}
                        </tr>
                        {dangerousPermissionsList
                            .filter((permission) =>
                                selectedServices.some((service) =>
                                    permissions[service.slug]?.permissions.includes(permission.name)
                                )
                            )
                            .map((permission) => (
                                <tr key={permission.name} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-gray-700 font-medium">
                                        {capitalizeFirstLetter(permission.label || permission.name)}
                                        <p className="text-xs text-gray-400 font-normal mt-0.5">{permission.description}</p>
                                    </td>
                                    {selectedServices.map((service) => (
                                        <td key={service.slug} className="p-4 text-center">
                                            {permissions[service.slug]?.permissions.includes(permission.name) ? (
                                                <div className="flex flex-col items-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 mb-1">
                                                        <AlertTriangle className="w-5 h-5" />
                                                    </span>
                                                    <span className="text-xs font-bold text-red-600">{t.t('access')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center">
                                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 mb-1">
                                                        <ShieldCheck className="w-5 h-5" />
                                                    </span>
                                                    <span className="text-xs font-medium text-green-600">{t.t('no')}</span>
                                                </div>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
