import java.util.Scanner;
public class ss2
{
    public static void main (String[]args){
     int Cost;
     int Itam=1;
     Scanner cost = new Scanner(System.in);
     System.out.println("Whats the cost of the first item ");
     Cost = cost.nextInt();
     int total = Cost;
     while (!(Cost == 0)){
         System.out.println("Cost of perchase "+Itam+" was "+Cost);
         Itam ++;
         System.out.println("whats the cost of item number "+Itam);
         Cost = cost.nextInt();
         total = total +Cost;
                 
     }
     System.out.println("your total is "+total);
    }
}
