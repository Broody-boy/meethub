export const useDevices = () => {

    const checkPermissions = async () => {
        try {
            const camera = await navigator.permissions.query({ name: "camera" });
            const microphone = await navigator.permissions.query({ name: "microphone" });

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
        
        const mics = devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => d.label || `Microphone ${d.deviceId.slice(0, 6)}`)

        return mics
    }

    const listCameras = async () => {

        const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.deviceId !== "communications" && d.label && d.label.trim() !== "");
        
        const cameras = devices
          .filter((d) => d.kind === "videoinput")
          .map((d) => d.label || `Camera ${d.deviceId.slice(0, 6)}`)

        return cameras
    }

    const listSpeakers = async () => {

        const devices = (await navigator.mediaDevices.enumerateDevices()).filter((d) => d.deviceId !== "communications" && d.label && d.label.trim() !== "");
        
        const speakers = devices
          .filter((d) => d.kind === "audiooutput")
          .map((d) => d.label || `Speaker ${d.deviceId.slice(0, 6)}`)

        return speakers
    }


    return {
        checkPermissions,
        listenPermissionChanges,
        listMicrophones,
        listCameras,
        listSpeakers
    }
}