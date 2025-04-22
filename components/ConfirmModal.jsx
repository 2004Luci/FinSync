import { XCircle } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
    if (!isOpen) return null;

    return (
        <>
            <div style={styles.overlay} className="z-50">
                <div style={styles.modal}>
                    <div className="flex flex-row items-center">
                        <XCircle className="h-4 w-4 mr-2 text-red-500" />
                        <h2 className="text-main/80">{message}</h2>
                    </div>
                    <div style={styles.buttonContainer}>
                        <button style={styles.button} onClick={onConfirm} className="bg-red-500 text-white">Delete</button>
                        <button style={styles.button} onClick={onClose} className="bg-subtext text-background">Cancel</button>
                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        background: '#2F3843',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
    },
    buttonContainer: {
        display: 'flex',
        justifyContent: 'space-around',
        marginTop: '10px',
    },
    button: {
        padding: '8px 16px',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '4px',
    },
};

export default ConfirmModal

