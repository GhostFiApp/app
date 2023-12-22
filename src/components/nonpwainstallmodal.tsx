import React from "react";

const NonPWAInstallModal = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-xl backdrop-filter backdrop-opacity-70">
            <div className="bg-black p-6 rounded-sm shadow-lg border border-sec text-center">
                <img src="/icon-512x512.png" alt="ghostfi.xyz app" className="mx-auto h-20 w-20" />
                <h2 className="text-xl font-semibold mb-4 text-white">
                    Install <span className="text-sec">Ghostfi</span>.xyz App!
                </h2>
                <p className="text-sm mb-4 text-white">
                    To install the ghostfi.xyz app, follow these steps:
                </p>
                <ul className="text-gray-200 text-xs pl-6 mb-4">
                    <li>1. Open your Safari browser menu.</li>
                    <li>2. Tap the "Share" icon.</li>
                    <li>3. Choose "Add to Home Screen" in the options.</li>
                    <li>4. Then open the ghostfi.xyz app on your home screen.</li>
                </ul>
            </div>
        </div>
    );
};

export default NonPWAInstallModal;