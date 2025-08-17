import { Toaster } from 'sonner'

export const ToastProvider = () => {
    return (
        <>
            <Toaster
                position='top-right'
                expand={true}
                richColors={false}
                closeButton={true}
                toastOptions={{
                    unstyled: true,
                    classNames: {
                        toast: '!bg-transparent !border-0 !shadow-none !p-0'
                    }
                }}
            />
        </>
    );
};
