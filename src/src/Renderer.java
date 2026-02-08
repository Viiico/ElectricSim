import javax.swing.*;
import java.awt.*;
import java.awt.event.*;

public class Renderer extends JPanel {
    public Field field;
    public float q1;
    public Renderer(Field field) {
        this.field = field;
        this.q1 = 250000;
        setBackground(Color.BLACK);

        addMouseListener(new MouseAdapter() {
            @Override
            public void mousePressed(MouseEvent e) {
                if (e.getButton() == MouseEvent.BUTTON1) {
                    int x = e.getX();
                    int y = e.getY();
                    field.addCharge(x, y, q1);
                    field.computeCurrent();
                }
                else if (e.getButton() == MouseEvent.BUTTON3){
                    int x = e.getX();
                    int y = e.getY();
                    field.addCharge(x, y, -1*q1);
                    field.computeCurrent();
                }
                else if (e.getButton() == MouseEvent.BUTTON2){
                    field.removeEveryCharge();
                    field.computeCurrent();
                }
            }
        });

    }

    @Override
    protected void paintComponent(Graphics g) {
        super.paintComponent(g);
        g.setColor(new Color(255, 255, 255));
        for (Vector vector : field.vectorField) {
            if (Math.sqrt(vector.e.eY * vector.e.eY + vector.e.eX * vector.e.eX) >= 1) {
                g.drawLine((int) vector.posX, (int) vector.posY, (int) (vector.posX + vector.e.eX), (int) (vector.posY + vector.e.eY));

                double alfa = Math.atan2(vector.e.eY, vector.e.eX);
                int l = 4;
                double phi = Math.PI / 6;

                g.drawLine((int) (vector.posX + vector.e.eX), (int) (vector.posY + vector.e.eY), (int) (vector.posX + vector.e.eX - l * Math.cos(alfa - phi)), (int) (vector.posY + vector.e.eY - l * Math.sin(alfa - phi)));
                g.drawLine((int) (vector.posX + vector.e.eX), (int) (vector.posY + vector.e.eY), (int) (vector.posX + vector.e.eX - l * Math.cos(alfa + phi)), (int) (vector.posY + vector.e.eY - l * Math.sin(alfa + phi)));
            }
            int d = 2;
            g.fillOval((int) vector.posX - d/2, (int) vector.posY - d/2, d, d);
        }

        int d = 16;
        for (ElectricCharge electricCharge : field.electricChargeList) {
            if(electricCharge.q >= 0){
                g.setColor(new Color(255, 0, 0));
            }
            else {
                g.setColor(new Color(0, 0, 255));
            }
            g.fillOval((int) electricCharge.posX - d/2, (int) electricCharge.posY - d/2, d, d);
        }
    }
}