package burp;

public class Config {
    private static final String EXTENDER_NAME = "HTTPDecrypt";
    private static final String EXTENDER_VERSION = "1.0";
    private static boolean IS_BODYAUTO = false;
    private static String WebServerURL= "http://127.0.0.1:8088/";
    private static String Reqfunc1 = "";
    private static String Reqfunc2 = "";
    private static String Respfunc3 = "";
    private static String Respfunc4= "";

    public static boolean isIsBodyAuto() {
        return IS_BODYAUTO;
    }

    public static void setIsBodyAuto(boolean IsBodyAuto) {
        IS_BODYAUTO = IsBodyAuto;
    }

    public static String getWebServerURL() {
        return WebServerURL;
    }

    public static void setWebServerURL(String url) {
        WebServerURL = url;
    }

    public static String getReqfunc1() {
        return Reqfunc1;
    }

    public static void setReqfunc1(String methodtag) {
        Reqfunc1 = methodtag;
    }

    public static String getReqfunc2() {
        return Reqfunc2;
    }

    public static void setReqfunc2(String methodtag) {
        Reqfunc2 = methodtag;
    }

    public static String getRespfunc3() {
        return Respfunc3;
    }

    public static void setRespfunc3(String methodtag) {
        Respfunc3 = methodtag;
    }

    public static String getRespfunc4() {
        return Respfunc4;
    }

    public static void setRespfunc4(String methodtag) {
        Respfunc4 = methodtag;
    }



}
