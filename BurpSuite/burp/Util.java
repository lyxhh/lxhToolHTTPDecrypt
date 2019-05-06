package burp;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.URL;
import java.net.URLConnection;
import java.util.List;

public class Util {

    public static String Encrypt(String hashname, String data) throws Exception {
//        hashname  sha1  SHA-224  SHA-256 SHA-384 SHA-512
        if (hashname.equals("") || null == hashname){return "hashname is null, please check...";}
        if (hashname.equals("16md5")) {
            return HashUtil.getMD516(data);
        } else if (hashname.equals("32md5")) {
            return HashUtil.getMD532(data);
        } else if (hashname.equals("SHA1") || hashname.equals("SHA-224") || hashname.equals("SHA-256") || hashname.equals("SHA-384") || hashname.equals("SHA-512")) {
            return HashUtil.getsha(data, hashname);
        }else if (hashname.equals("methodtag")){
//            return
        }

        return null;
    }

    public static String getArgs(List<IParameter> parameters, String key1, String value) {
        for (IParameter i : parameters) {
            if (Byte.toString(i.getType()).equals(key1) && i.getName().equals(value)) {
                return key1 + "_" + i.getName() + "=" + i.getValue();
            }
        }
        return "not found " + value + " Parameter, please check.";
    }

    public static String getHeaderArgs(List<String> Headers, String name) {
        for (String myheader : Headers) {
            String temp = name + ":";
            if (myheader.startsWith(temp)) {
                //Header
                return "SGVhZGVy_" + name + "=" + myheader.replace(temp, "").trim();
            }
        }
        return "not found " + name + " Parameter, please check.";
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
            System.out.println("发送 POST 请求出现异常！" + e);
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
