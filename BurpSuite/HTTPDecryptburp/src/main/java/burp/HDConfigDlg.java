package burp;

import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

//https://github.com/c0ny1/sqlmap4burp-plus-plus/blob/master/src/main/java/burp/ConfigDlg.java

public class HDConfigDlg extends JDialog {
    private final JPanel mainPanel = new JPanel();

    private final JLabel lbURL =  new JLabel("HTTPDecrypt WebServer URL:");
    private final JTextField tfURL = new JTextField(30);

    private final JLabel lbrpcfunc1 = new JLabel("Custom Request functions1:");
    private final JTextField tfrpcfunc1 = new JTextField(30);


    private final JLabel lbrpcfunc2 = new JLabel("Custom Request functions2:");
    private final JTextField tfrpcfunc2 = new JTextField(30);

    private final JCheckBox jBodyCheckBox = new JCheckBox("Body Auto");

    private final JLabel lbPrompt = new JLabel("Prompt:");

    private final JLabel lbrpcfunc3 = new JLabel("Custom Response functions3:");
    private final JTextField tfrpcfunc3 = new JTextField(30);

    private final JLabel lbrpcfunc4 = new JLabel("Custom Response functions4:");
    private final JTextField tfrpcfunc4 = new JTextField(30);

    private final JButton btnOK = new JButton("OK");
    private final JButton btnCancel = new JButton("Cancel");
    private final JButton btnTest = new JButton("Test");


    public HDConfigDlg(){
        initGUI();
        initEvent();
        this.setTitle("HTTPDecrypt Config");
    }


    /**
     * 初始化UI
     */
    private void initGUI(){
        String webServerURL = Config.getWebServerURL();
        String reqfunc1 = Config.getReqfunc1();
        String reqfunc2 = Config.getReqfunc2();
        String respfunc3 = Config.getRespfunc3();
        String respfunc4 = Config.getRespfunc4();
        boolean isBodyAuto = Config.isIsBodyAuto();

        mainPanel.setLayout(new GridBagLayout());

        mainPanel.add(lbURL,new GBC(0,0,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        if (webServerURL.equals("")){
            tfURL.setText("http://127.0.0.1:8088/");
        }else{
            tfURL.setText(webServerURL);
        }
        mainPanel.add(tfURL, new GBC(2,0,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(lbrpcfunc1,new GBC(0,1,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        if (!reqfunc1.equals("")){
            tfrpcfunc1.setText(reqfunc1);
        }
        mainPanel.add(tfrpcfunc1,new GBC(2,1,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));


        jBodyCheckBox.setSelected(isBodyAuto);

        mainPanel.add(jBodyCheckBox,new GBC(5,0,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(btnTest,new GBC(5,1,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));


        mainPanel.add(lbrpcfunc2,new GBC(0,2,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        if (!reqfunc2.equals("")){
            tfrpcfunc2.setText(reqfunc2);
        }
        mainPanel.add(tfrpcfunc2,new GBC(2,2,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(lbrpcfunc3,new GBC(0,3,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        if (!respfunc3.equals("")){
            tfrpcfunc3.setText(respfunc3);
        }
        mainPanel.add(tfrpcfunc3, new GBC(2,3,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(lbrpcfunc4,new GBC(0,4,2,1).setFill(GBC.BOTH).setInsets(10,10,2,0));
        if (!respfunc4.equals("")){
            tfrpcfunc4.setText(respfunc4);
        }
        mainPanel.add(tfrpcfunc4, new GBC(2,4,3,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        mainPanel.add(btnOK,new GBC(0,5,1,1).setFill(GBC.BOTH).setInsets(10,10,10,0));
        mainPanel.add(btnCancel,new GBC(1,5,1,1).setFill(GBC.BOTH).setInsets(10,0,10,10));
//        mainPanel.add(btnTest,new GBC(1,5,1,1).setFill(GBC.BOTH).setInsets(10,0,10,10));


        lbPrompt.setText("Notice: The command will be copied to the clipboard. Paste it into Terminal!");
        mainPanel.add(lbPrompt,new GBC(2,5,1,1).setFill(GBC.BOTH).setInsets(10,0,2,10));

        lbPrompt.setForeground(new Color(0,0,255));

        this.setModal(true);
        this.setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);
        this.add(mainPanel);
        //使配置窗口自动适应控件大小，防止部分控件无法显示
        this.pack();
        //居中显示配置窗口
        Dimension screensize=Toolkit.getDefaultToolkit().getScreenSize();
        this.setBounds(screensize.width/2-this.getWidth()/2,screensize.height/2-this.getHeight()/2,this.getWidth(),this.getHeight());
        BurpExtender.callbacks.customizeUiComponent(this);
    }


    /**
     * 初始化事件
     */
    private void initEvent(){

        btnOK.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                Config.setWebServerURL(tfURL.getText().trim());
                Config.setReqfunc1(tfrpcfunc1.getText().trim());
                Config.setReqfunc2(tfrpcfunc2.getText().trim());
                Config.setRespfunc3(tfrpcfunc3.getText().trim());
                Config.setRespfunc4(tfrpcfunc4.getText().trim());
                Config.setIsBodyAuto(jBodyCheckBox.isSelected());
                HDConfigDlg.this.dispose();
            }
        });

        btnCancel.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

                HDConfigDlg.this.dispose();
            }
        });
        btnTest.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                BurpExtender.stdout.println(Util.Test());
                HDConfigDlg.this.dispose();
            }
        });


    }

}
