import java.util.ArrayList;
import java.util.List;

public class Field {
    public List<Vector> vectorField;
    public List<ElectricCharge> electricChargeList;
    public static float k = 1;
    public static final int width = 1920;
    public static final int height = 1080;
    public static final int eps = 90;

    public Field(List<Vector> vectorField, List<ElectricCharge> electricChargeList) {
        this.vectorField = vectorField;
        this.electricChargeList = electricChargeList;
    }

    public Field(int nX, int nY) {
        this.electricChargeList = new ArrayList<>();
        this.vectorField = new ArrayList<>();
        for(int i = 0; i < nX; i++){
            for(int j = 0; j < nY; j++){
                this.vectorField.add(new Vector(width*i/(nX-1), height*j/(nY-1), new Current(0,0)));
            }
        }
    }

    public void addCharge(float posX, float posY, float q){
        this.electricChargeList.add(new ElectricCharge(posX, posY, q));
    }

    public void removeEveryCharge(){
        this.electricChargeList.clear();
    }

    public void computeCurrent(){
        for(Vector vector : this.vectorField){
            vector.e.eX = 0;
            vector.e.eY = 0;
        }

        for(Vector vector : this.vectorField){
            for(ElectricCharge electricCharge : electricChargeList){
                double alfa = Math.atan2((vector.posY - electricCharge.posY),(vector.posX - electricCharge.posX));
                float r = (float) Math.sqrt((vector.posX - electricCharge.posX)*(vector.posX - electricCharge.posX)+(vector.posY - electricCharge.posY)*(vector.posY - electricCharge.posY)+eps*eps);

                float e = k*electricCharge.q/(r*r);
                vector.e.eX += (float) (Math.cos(alfa)*e);
                vector.e.eY += (float) (Math.sin(alfa)*e);
            }
        }
    }

}
