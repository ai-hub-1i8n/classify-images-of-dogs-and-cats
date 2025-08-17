import type { ToastOptions } from './IProps'
import { toast as sonnerToast } from "sonner"
import { cn } from '@/lib/utils'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { toastStyles } from './variants'
import { Button } from '../ui/button'

const toastIcons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
    default: Info,
}

export function Toast({ title, action, description, dismissible = true, type = 'default', variant = 'filled', onDismiss }: ToastOptions & { onDismiss?: () => void }) {
    const Icon = toastIcons[type]
    const style = toastStyles[variant][type]
    return (
        <div
            className={cn(
                "relative flex w-full items-start gap-3 rounded-lg border p-4 shadow-lg animate-in slide-in-from-right-full duration-300",
                style
            )}
        >
            <Icon className='h-5 w-5 shrink-0 mt-0.5' />
            <div className='flex-1 space-y-1'>
                {title && <div className='font-semibold text-sm leading-none'>{title}</div>}
                {description && <div className='text-sm opacity-90 leading-relaxed'>{description}</div>}
                {action && (
                    <Button
                        onClick={action.onClick}
                        className={cn(
                            "mt-2 text-xs font-medium underline underline-offset-2",
                            "hover:no-underline transition-all duration-200"
                        )}
                    >
                        {action.label}
                    </Button>
                )}
            </div>

            {dismissible && (
                <Button
                    className={cn(
                        "shrink-0 opacity-70 hover:backdrop-opacity-10", "transition-opacity duration-200"
                    )}
                    onClick={onDismiss}
                >
                    <X className='h-4 w-4' />
                </Button>
            )}

        </div>
    )
}

export const toast = {
    success: (options: Omit<ToastOptions, "type">) =>
        sonnerToast.custom((t) => <Toast {...options} type="success" onDismiss={() => sonnerToast.dismiss(t)} />, {
            duration: options.duration,
        }),

    error: (options: Omit<ToastOptions, "type">) =>
        sonnerToast.custom((t) => <Toast {...options} type="error" onDismiss={() => sonnerToast.dismiss(t)} />, {
            duration: options.duration,
        }),

    warning: (options: Omit<ToastOptions, "type">) =>
        sonnerToast.custom((t) => <Toast {...options} type="warning" onDismiss={() => sonnerToast.dismiss(t)} />, {
            duration: options.duration,
        }),

    info: (options: Omit<ToastOptions, "type">) =>
        sonnerToast.custom((t) => <Toast {...options} type="info" onDismiss={() => sonnerToast.dismiss(t)} />, {
            duration: options.duration,
        }),

    default: (options: Omit<ToastOptions, "type">) =>
        sonnerToast.custom((t) => <Toast {...options} type="default" onDismiss={() => sonnerToast.dismiss(t)} />, {
            duration: options.duration,
        }),

    show: (options: ToastOptions) => {
        const { type = "default", ...rest } = options
        return toast[type](rest)
    },

    dismiss: (id?: string | number) => sonnerToast.dismiss(id),
    dismissAll: () => sonnerToast.dismiss(),
}