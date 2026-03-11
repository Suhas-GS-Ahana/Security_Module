import React from 'react';
import { cn } from '@/utils';

export default function Card({ children, className = '', title, description, icon: Icon, headerVariant = 'default' }) {
  return (
    <div className={cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden",
      "hover:shadow-md transition-shadow duration-300",
      className
    )}>
      {title && (
        <div className={cn(
          "px-6 py-5 border-b flex items-center space-x-3",
          headerVariant === 'gradient' ? "gradient-header border-none" : "bg-muted/30"
        )}>
          {Icon && (
            <div className={cn(
              "p-2 rounded-lg", 
              headerVariant === 'gradient' ? "bg-white/20" : "bg-primary/10 text-primary"
            )}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className={cn(
              "text-lg font-semibold tracking-tight",
              headerVariant === 'gradient' ? "text-white" : ""
            )}>
              {title}
            </h3>
            {description && (
              <p className={cn(
                "text-sm", 
                headerVariant === 'gradient' ? "text-blue-100" : "text-muted-foreground"
              )}>
                {description}
              </p>
            )}
          </div>
        </div>
      )}
      <div className="p-6">
        {children}
      </div>
    </div>
  );
}
