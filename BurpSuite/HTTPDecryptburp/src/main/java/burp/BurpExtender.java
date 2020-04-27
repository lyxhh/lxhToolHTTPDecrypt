package burp;

import org.apache.commons.lang3.ArrayUtils;

import javax.swing.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class BurpExtender implements IBurpExtender,IContextMenuFactory,ActionListener,IHttpListener {

    public static IExtensionHelpers helpers;
    public static IBurpExtenderCallbacks callbacks;
    public static PrintWriter stdout;
    public static PrintWriter stderr;

    private IContextMenuInvocation currentInvocation;

    public void registerExtenderCallbacks(IBurpExtenderCallbacks callbacks) {
        this.helpers = callbacks.getHelpers();
        this.callbacks = callbacks;
        this.stdout = new PrintWriter(callbacks.getStdout(),true);
        this.stderr = new PrintWriter(callbacks.getStderr(),true);

        callbacks.registerContextMenuFactory(this);
        callbacks.registerHttpListener(this);
    }

    public List<JMenuItem> createMenuItems(IContextMenuInvocation invocation) {

        if (invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_REQUEST ||
                invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_RESPONSE) {

            this.currentInvocation = invocation;

            List<JMenuItem> listMenuItems = new ArrayList<JMenuItem>();

            JMenuItem jMenuItem = new JMenuItem("Send to HTTPDecrypt");
            jMenuItem.setActionCommand("HDSetting");
            jMenuItem.addActionListener(this);

            JMenuItem jMenuItem1 = new JMenuItem("Custom Request functions1");
            jMenuItem1.setActionCommand("contextcustom1");
            jMenuItem1.addActionListener(this);

            JMenuItem jMenuItem2 = new JMenuItem("Custom Request functions2");
            jMenuItem2.setActionCommand("contextcustom2");
            jMenuItem2.addActionListener(this);

            listMenuItems.add(jMenuItem);
            listMenuItems.add(jMenuItem1);
            listMenuItems.add(jMenuItem2);

            return listMenuItems;
        } else if (invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_REQUEST ||
                invocation.getInvocationContext() == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_RESPONSE) {

            this.currentInvocation = invocation;

            List<JMenuItem> listMenuItems = new ArrayList<JMenuItem>();

            JMenuItem jMenuItem = new JMenuItem("Send to HTTPDecrypt");
            jMenuItem.setActionCommand("HDSetting");
            jMenuItem.addActionListener(this);


            JMenuItem jMenuItem3 = new JMenuItem("Custom Response functions3");
            jMenuItem3.setActionCommand("contextcustom3");
            jMenuItem3.addActionListener(this);

            JMenuItem jMenuItem4 = new JMenuItem("Custom Response functions4");
            jMenuItem4.setActionCommand("contextcustom4");
            jMenuItem4.addActionListener(this);

            listMenuItems.add(jMenuItem);
            listMenuItems.add(jMenuItem3);
            listMenuItems.add(jMenuItem4);
            return listMenuItems;
        } else {
            return null;
        }

    }

    public void actionPerformed(ActionEvent event) {
        String command = event.getActionCommand();
        String buildArgResult = "";
        String methodtag = "";

        if (command.equals("contextcustom1") || command.equals("contextcustom2")) {

            methodtag = (command.equals("contextcustom1")) ? Config.getReqfunc1() : Config.getReqfunc2();
            if (methodtag.equals("")) {
                BurpExtender.stderr.println("methodtag is Null, please check Custom Request functions1 or 2...");
                return;
            }

            IHttpRequestResponse[] selectedItems = this.currentInvocation.getSelectedMessages();
            int[] selectedBounds = this.currentInvocation.getSelectionBounds();
            byte selectedInvocationContext = this.currentInvocation.getInvocationContext();

            try {
                String flags = "";
                byte[] selectedRequestOrResponse = null;
                if (selectedInvocationContext == IContextMenuInvocation.CONTEXT_MESSAGE_EDITOR_REQUEST) {
                    selectedRequestOrResponse = selectedItems[0].getRequest();
                } else {
                    selectedRequestOrResponse = selectedItems[0].getResponse();
                    flags = "1";
                }

                byte[] preSelectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, 0, selectedBounds[0]);
                byte[] selectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[0], selectedBounds[1]);
                byte[] postSelectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[1], selectedRequestOrResponse.length);

                buildArgResult = this.buildArgMessage(methodtag, selectedPortion);

                byte[] newRequest = ArrayUtils.addAll(preSelectedPortion, Util.sendPost(Config.getWebServerURL(), buildArgResult).getBytes("utf-8"));
                newRequest = ArrayUtils.addAll(newRequest, postSelectedPortion);
                if (flags.equals("1")){
                    selectedItems[0].setResponse(newRequest);
                }else {
                    selectedItems[0].setRequest(newRequest);
                }
            } catch (Exception e) {
                BurpExtender.stdout.print("Exception with custom context application");
            }
        } else if (command.equals("contextcustom3") || command.equals("contextcustom4")) {
            methodtag = (command.equals("contextcustom3")) ? Config.getRespfunc3() : Config.getRespfunc4();
            if (methodtag.equals("") ) {
                BurpExtender.stderr.println("methodtag is Null, please check Custom Response functions3 or 4...");
                return;
            }

            IHttpRequestResponse[] selectedItems = currentInvocation.getSelectedMessages();
            int[] selectedBounds = currentInvocation.getSelectionBounds();
            byte selectedInvocationContext = currentInvocation.getInvocationContext();

            try {

                byte[] selectedRequestOrResponse = null;
                if (selectedInvocationContext == IContextMenuInvocation.CONTEXT_MESSAGE_VIEWER_REQUEST) {
                    selectedRequestOrResponse = selectedItems[0].getRequest();
                } else {
                    selectedRequestOrResponse = selectedItems[0].getResponse();
                }

                byte[] selectedPortion = Arrays.copyOfRange(selectedRequestOrResponse, selectedBounds[0], selectedBounds[1]);
                buildArgResult = this.buildArgMessage(methodtag, selectedPortion);

                String result = Util.sendPost(Config.getWebServerURL(), buildArgResult);

                SwingUtilities.invokeLater(new Runnable() {

                    @Override
                    public void run() {

                        JTextArea ta = new JTextArea(10, 30);
                        ta.setText(result);
                        ta.setWrapStyleWord(true);
                        ta.setLineWrap(true);
                        ta.setCaretPosition(0);
                        ta.setEditable(false);

                        JOptionPane.showMessageDialog(null, new JScrollPane(ta), "Custom invocation response", JOptionPane.INFORMATION_MESSAGE);

                    }

                });
            } catch (Exception e) {
                BurpExtender.stdout.print("Exception with custom context application");
            }
        } else if (command.equals("HDSetting")){
            HDConfigDlg cfd = new HDConfigDlg();
            cfd.setVisible(true);
//            cfd.show();
        }

    }

    private String buildArgMessage(String methodtag, byte[] BodyContentOrSelectContent) throws UnsupportedEncodingException {
        StringBuffer paramsBuffer = new StringBuffer();

        StringBuffer dictBuffer = new StringBuffer();

        paramsBuffer.append("methodtag=");
        paramsBuffer.append(BurpExtender.helpers.base64Encode(methodtag));

        paramsBuffer.append("&argsinfo=");
        dictBuffer.append("{");
        dictBuffer.append("\"0\":");
        dictBuffer.append("\"");
        dictBuffer.append(BurpExtender.helpers.base64Encode(BodyContentOrSelectContent));
        dictBuffer.append("\"");
        dictBuffer.append("}");

        paramsBuffer.append(URLEncoder.encode(dictBuffer.toString(), "UTF-8"));

        return paramsBuffer.toString();
    }

    @Override
    public void processHttpMessage(int toolFlag, boolean messageIsRequest, IHttpRequestResponse messageInfo) throws UnsupportedEncodingException {
        // TOOL_REPEATER     TOOL_SCANNER     TOOL_INTRUDER
        if (Config.isIsBodyAuto()) {
            if (64 == toolFlag || 16 == toolFlag || 32 == toolFlag) {
                if (messageIsRequest) {
                    byte[] request = messageInfo.getRequest();
                    IRequestInfo analyzeRequest = BurpExtender.helpers.analyzeRequest(request);

                    byte[] body = Arrays.copyOfRange(request, analyzeRequest.getBodyOffset(), request.length);
                    String methodtag = Config.getReqfunc1();
                    if (methodtag.equals("")){
                        BurpExtender.stderr.println("Custom Request functions1 is null,please check...");
                        return;
                    }
                    String ResultArg = this.buildArgMessage(methodtag, body);
                    String Result = Util.sendPost(Config.getWebServerURL(), ResultArg);
                    messageInfo.setRequest(BurpExtender.helpers.buildHttpMessage(analyzeRequest.getHeaders(), Result.getBytes("utf-8")));
                } else {
                    byte[] response = messageInfo.getResponse();
                    IResponseInfo analyzedResponse = BurpExtender.helpers.analyzeResponse(response);

                    byte[] body = Arrays.copyOfRange(response, analyzedResponse.getBodyOffset(), response.length);
                    String methodtag = Config.getReqfunc2();
                    if (methodtag.equals("")){
                        BurpExtender.stderr.println("Custom Request functions2 is null,please check...");
                        return;
                    }
                    String ResultArg = this.buildArgMessage(methodtag, body);

                    String Result = Util.sendPost(Config.getWebServerURL(), ResultArg);
                    messageInfo.setResponse(BurpExtender.helpers.buildHttpMessage(analyzedResponse.getHeaders(), Result.getBytes("utf-8")));
                }
            }
        }
    }
}
