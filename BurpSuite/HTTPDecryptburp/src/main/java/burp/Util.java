package burp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;


public class Util {

    public static String Test(){
        String test = "[+] WebServer: " + Config.getWebServerURL() + " \n"
                + "[+] Request  functions1: "+ Config.getReqfunc1()+"\n"
                + "[+] Request  functions2: "+ Config.getReqfunc2()+"\n"
                + "[+] Response functions3: "+ Config.getRespfunc3()+"\n"
                + "[+] Response functions4: "+ Config.getRespfunc4()+"\n"
                + "[+] isBodyAuto "+ Config.isIsBodyAuto()+"\n";
        return test;
    }

    public static String sendPost(String url, String param) {
        PrintWriter out = null;
        BufferedReader in = null;
        String result = "";
        try {
            URL realUrl = new URL(url + "bcall");

            URLConnection conn = realUrl.openConnection();// open url
            // Set HTTPHeader
            conn.setRequestProperty("accept", "*/*");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            conn.setRequestProperty("user-agent", "Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1;SV1)");

            // POST Method never
            conn.setDoOutput(true);
            conn.setDoInput(true);

            out = new PrintWriter(conn.getOutputStream()); // Get URLConnection PrintWriter

            out.print(param); // POST Args
            out.flush();

            // Define BufferedReader read Response
            in = new BufferedReader(new InputStreamReader(conn.getInputStream(), "utf-8"));
            String line;
            while ((line = in.readLine()) != null) {
                result += line;
            }
            return result;
        } catch (Exception e) {
            BurpExtender.stderr.println("send to POST requests error, " + e);
//            System.out.println("发送 POST 请求出现异常！" + e);
            e.printStackTrace();
        } // close
        finally {
            try {
                if (out != null) {
                    out.close();
                }
                if (in != null) {
                    in.close();
                }
            } catch (IOException exx) {
                exx.printStackTrace();
            }
        }
        return "sendPost Error, please check...";
    }
}
