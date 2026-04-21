function getPermissionStatusFromError(error: unknown) {
  if (error instanceof DOMException && error.name === "NotAllowedError") {
    return "denied";
  }
  return "error";
}

const useMediaPermissions = () => {
    
  async function checkCameraPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach((t) => t.stop());
      return "granted";
    } catch (error: unknown) {
      return getPermissionStatusFromError(error);
    }
  }
  
  async function checkMicPermission() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      return "granted";
    } catch (error: unknown) {
      return getPermissionStatusFromError(error);
    }
  }
  
  async function checkAudioVideoPermissionAndReturnStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      // stream.getTracks().forEach((t) => t.stop());
      return { success: true as const, stream };
    } catch {
      return { success: false as const, stream: null };
    }
  }
  
  async function checkMediaPermissionsAndReturnStream() {
    const audioVideoResult = await checkAudioVideoPermissionAndReturnStream();
    if (audioVideoResult.success) {
      return { camera: "granted", mic: "granted", stream: audioVideoResult.stream };
    }
  
    const [camera, mic] = await Promise.all([checkCameraPermission(), checkMicPermission()]);
    return { camera, mic, stream: null };
  }

  return {
    checkMediaPermissionsAndReturnStream
  }
}


export {useMediaPermissions} // same as writing export const useMediaPermissions = () => { ... }