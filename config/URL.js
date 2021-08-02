const endPoint = "";

export const host = {
    login: endPoint + "/host/cameraLogin",
    logout: endPoint + "/host/cameraLogOut",
    getSetting: endPoint + "/host/getMySettings",
    updateSession: endPoint + "/host/updateSessionDetails",
};

export const client = {
    addCamera: endPoint + "/client/addCamera",
    updateSettings: endPoint + "/client/updateSettings",
    getSettings: endPoint + "/client/getCameraSettings",
};
