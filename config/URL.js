const endPoint = "https://us-central1-tusc-91a8b.cloudfunctions.net/app";

export const host = {
    login: endPoint + "/host/login",
    logout: endPoint + "/host/logout",
    getSetting: endPoint + "/host/getSettings",
    updateSession: endPoint + "/host/updateSettings",
    makeCall: (phoneArr)=>{
        let stringPhone = phoneArr.join(',');
        return "http://sms.hspsms.com/SENDVOICEAPI?fileurl=http://sms.hspsms.com/UploadFile/4411320210809151309.mp3&numbers="+stringPhone+"&apikey=58d0c60e-84cb-484c-8fc4-b900d9ec2345&username=hansraj_flyzy&service=VOICETRANS&callerid=6364656768";
    },
};

export const client = {
    addCamera: endPoint + "/client/addCamera",
    updateSettings: endPoint + "/client/updateSettings",
    getSettings: endPoint + "/client/getSettings",
};
