import java.util.Scanner;
import java.lang.Math;
public class ss1{
    public static void main(String[] args){
        int Number;
        System.out.println("what number do you want to get the square root of");
        Scanner number = new Scanner(System.in);
        Number = number.nextInt();
        int loop = 10;
       
        while (!(loop == 20)){
            if(Number>=0) {
                System.out.println("the square root of "+Number+" is "+Math.sqrt(Number));
                System.out.println("what number do you want to get the square root of");
                Number = number.nextInt();     
            }else{
                System.out.println("you cant do that");
                System.out.println("what number do you want to get the square root of");
                Number = number.nextInt();  
            }
    }
    }
}
    
       

