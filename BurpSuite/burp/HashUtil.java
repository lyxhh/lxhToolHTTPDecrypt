package burp;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class HashUtil {

    public static String getMD532(String need2Encode) throws NoSuchAlgorithmException {
        byte[] buf = need2Encode.getBytes();
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        md5.update(buf);
        byte[] tmp = md5.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : tmp) {
            if (b >= 0 && b < 16)
                sb.append("0");
            sb.append(Integer.toHexString(b & 0xff));
        }
        return sb.toString();
    }

    public static String getMD516(String need2Encode) throws NoSuchAlgorithmException {
        byte[] buf = need2Encode.getBytes();
        MessageDigest md5 = MessageDigest.getInstance("MD5");
        md5.update(buf);
        byte[] tmp = md5.digest();
        StringBuilder sb = new StringBuilder();
        for (byte b : tmp) {
            if (b >= 0 && b < 16)
                sb.append("0");
            sb.append(Integer.toHexString(b & 0xff));
        }
        return sb.toString().substring(8, 24);
    }

    public static String getsha(String inStr, String hashname) throws Exception {
        MessageDigest sha = MessageDigest.getInstance(hashname);
//        hashname  sha1  SHA-224  SHA-256 SHA-384 SHA-512
        byte[] byteArray = inStr.getBytes("UTF-8");
        byte[] md5Bytes = sha.digest(byteArray);
        StringBuffer hexValue = new StringBuffer();
        for (int i = 0; i < md5Bytes.length; i++) {
            int val = ((int) md5Bytes[i]) & 0xff;
            if (val < 16) {
                hexValue.append("0");
            }
            hexValue.append(Integer.toHexString(val));
        }
        return hexValue.toString();
    }


}