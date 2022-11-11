package com.ptit.model;

import java.awt.*;

// Mô tả trạng thái của một vị trí trên bàn cờ: vị trí và giá trị
public class State {
    private Point p; // vị trí p = new Point(x, y)
    private int val; // giá trị

    public State(Point p, int val) {
        this.p = new Point(p);
        this.val = val;
    }

    public void Set(Point p, int val) {
        this.p = new Point(p);
        this.val = val;
    }

    public Point getP() {
        return p;
    }

    public void setP(Point p) {
        this.p = p;
    }

    public int getVal() {
        return val;
    }

    public void setVal(int val) {
        this.val = val;
    }
}
