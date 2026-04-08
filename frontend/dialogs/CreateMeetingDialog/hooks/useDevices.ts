export const useDevices = () => {

    const checkPermissions = async () => {
        try {
            const camera = await navigator.permissions.query({ name: "camera" as PermissionName });
            const microphone = await navigator.permissions.query({ name: "microphone" as PermissionName });

            return {
                camera,
                microphone
            };
        } catch (err) {
            console.error("Permissions API not supported", err);
        }
    }

    const listenPermissionChanges = (permissionStatus: PermissionStatus, cb: (_: string) => void) => {
        permissionStatus.onchange = () => {
            cb(permissionStatus.state);
        };
    }

    const listMicrophones = async () => {
        const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.deviceId !== "communications" && d.label && d.label.trim() !== "");
        return devices.filter((d) => d.kind === "audioinput").map((d) => d.label || `Microphone ${d.deviceId.slice(0, 6)}`)
    }

    const listCameras = async () => {
        const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.deviceId !== "communications" && d.label && d.label.trim() !== "");
        return devices.filter((d) => d.kind === "videoinput").map((d) => d.label || `Camera ${d.deviceId.slice(0, 6)}`)
    }

    const listSpeakers = async () => {
        const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.deviceId !== "communications" && d.label && d.label.trim() !== "");
        return devices.filter((d) => d.kind === "audiooutput").map((d) => d.label || `Speaker ${d.deviceId.slice(0, 6)}`)
    }

    /**
     * Request a media stream with the given constraints.
     * Returns the stream or throws with a user-friendly error message.
     */
    const getUserMedia = async (constraints: MediaStreamConstraints): Promise<MediaStream> => {
        try {
            return await navigator.mediaDevices.getUserMedia(constraints);
        } catch (err: unknown) {
            if (err instanceof DOMException) {
                if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    throw new Error("Permission denied. Please allow camera/microphone access in your browser settings.");
                }
                if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    throw new Error("No camera or microphone found on this device.");
                }
                if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                    throw new Error("Camera or microphone is already in use by another application.");
                }
                if (err.name === "OverconstrainedError") {
                    throw new Error("The selected device does not support the requested settings.");
                }
            }
            throw new Error("Could not access camera or microphone.");
        }
    }

    return {
        checkPermissions,
        listenPermissionChanges,
        listMicrophones,
        listCameras,
        listSpeakers,
        getUserMedia,
    }
}
