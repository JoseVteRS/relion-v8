"use client";

import { ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { memo } from "react";

function PublicListOwnerBlockComponent() {
  return (
    <div className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800" />
      
      {/* Decorative circles */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-amber-200/30 dark:bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-rose-200/30 dark:bg-rose-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-200/20 dark:bg-orange-500/5 rounded-full blur-2xl" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-lg mx-auto">
        {/* Icon */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 bg-amber-400/20 dark:bg-amber-500/20 rounded-3xl blur-xl scale-150" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 border border-amber-200/50 dark:border-amber-700/30 shadow-lg shadow-amber-500/10">
            <div className="relative">
              <Eye className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              <EyeOff className="w-5 h-5 text-amber-700 dark:text-amber-300 absolute -bottom-1 -right-1 bg-white dark:bg-zinc-800 rounded-full p-0.5" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-800 dark:text-zinc-100 mb-4 tracking-tight">
          Esta es tu propia lista
        </h2>

        {/* Description */}
        <p className="text-base text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
          No puedes ver los estados de los regalos de tu propia lista personal para mantener la sorpresa de quienes te regalan.
        </p>

        {/* CTA Button */}
        <Link
          href="/dashboard/lists"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-medium text-sm hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/20 dark:shadow-zinc-100/10 group"
        >
          <span>Ir al panel de control</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}

export const PublicListOwnerBlock = memo(PublicListOwnerBlockComponent);

