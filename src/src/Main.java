import javax.swing.*;
import javax.swing.plaf.basic.BasicSliderUI;
import java.awt.*;

public class Main {
    public static void main(String[] args) {

        JFrame frame = new JFrame("Current Field");
        Renderer renderer = new Renderer(new Field(64, 36));

        renderer.setPreferredSize(new java.awt.Dimension(Field.width, Field.height));
        JLabel valueLabel = new JLabel("|q| value is set to 250000, Left click to add positive charge, Right click to add negative charge, Middle click to reset");
        JSlider slider = new JSlider(0, 1000000, 250000);

        slider.setUI(new BasicSliderUI(slider) {
            @Override
            public void paintTrack(Graphics g) {
                g.setColor(Color.WHITE);
                g.fillRect(trackRect.x, trackRect.y + trackRect.height / 2 - 1,
                        trackRect.width, 2);
            }

            @Override
            public void paintThumb(Graphics g) {
                g.setColor(Color.WHITE);
                g.fillRect(thumbRect.x, thumbRect.y + thumbRect.height/4, thumbRect.width, thumbRect.height/2);
            }
        });

        slider.setPaintTicks(true);
        slider.setPaintLabels(true);
        slider.setMajorTickSpacing(100000);
        slider.setOpaque(false);
        slider.setBackground(Color.BLACK);
        slider.setForeground(Color.WHITE);
        slider.setFocusable(false);

        slider.addChangeListener(e -> {
            renderer.q1 = slider.getValue();
            valueLabel.setText("|q| value is set to " + slider.getValue() + "C, Left click to add positive charge, Right click to add negative charge, Middle click to reset");
        });

        JPanel controlPanel = new JPanel();

        controlPanel.setLayout(new BoxLayout(controlPanel, BoxLayout.Y_AXIS));
        controlPanel.add(slider);
        controlPanel.add(valueLabel);
        valueLabel.setAlignmentX(Component.CENTER_ALIGNMENT);
        valueLabel.setForeground(Color.WHITE);
        controlPanel.setBackground(Color.BLACK);

        frame.setLayout(new java.awt.BorderLayout());
        frame.add(renderer, java.awt.BorderLayout.CENTER);
        frame.add(controlPanel, BorderLayout.SOUTH);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setExtendedState(JFrame.MAXIMIZED_BOTH);
        frame.setVisible(true);

        Timer timer = new Timer(16, e -> {
            renderer.repaint();
        });
        timer.start();
    }
}