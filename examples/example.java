// Package declaration
package com.example.syntax;

// Imports
import java.util.*;
import java.io.*;
import static java.lang.Math.*;

// Class definition with inheritance and interface implementation
public class JavaSyntaxExample extends ParentClass implements Interface1, Interface2 {
    // Class-level fields
    private int privateField;
    protected String protectedField;
    public static final double CONSTANT = 3.14159;
    volatile boolean volatileField;
    transient long transientField;
    
    // Static block
    static {
        System.out.println("Static initialization block");
    }
    
    // Constructor
    public JavaSyntaxExample(int value) {
        super();  // Call parent constructor
        this.privateField = value;
    }
    
    // Method with annotations
    @Override
    @Deprecated
    public void methodExample(String param1, int... varArgs) throws Exception {
        // Local variable declarations
        int localVar = 42;
        final String immutable = "Can't change this";
        
        // Control structures
        if (localVar > 0) {
            System.out.println("Positive");
        } else if (localVar < 0) {
            System.out.println("Negative \n");
        } else {
            System.out.println("Zero");
        }
        
        // Switch statement
        switch (localVar) {
            case 1:
                System.out.println("One");
                break;
            case 2:
                System.out.println("Two");
                break;
            default:
                System.out.println("Other");
        }
        
        // Enhanced switch (Java 14+)
        String result = switch (localVar) {
            case 1 -> "One";
            case 2 -> "Two";
            default -> "Other";
        };
        
        // Loops
        for (int i = 0; i < 10; i++) {
            if (i == 5) continue;
            if (i == 8) break;
            System.out.println(i);
        }
        
        // Enhanced for loop
        List<String> items = new ArrayList<>();
        for (String item : items) {
            System.out.println(item);
        }
        
        // While loop
        while (localVar > 0) {
            localVar--;
        }
        
        // Do-while loop
        do {
            localVar++;
        } while (localVar < 10);
        
        // Try-catch-finally
        try {
            throwsException();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (Exception e) {
            throw new RuntimeException(e);
        } finally {
            System.out.println("Always executes");
        }
        
        // Try-with-resources
        try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
            String line = reader.readLine();
        }
        
        // Lambda expressions
        Runnable lambda = () -> System.out.println("Lambda");
        
        // Method reference
        List<String> list = Arrays.asList("a", "b", "c");
        list.forEach(System.out::println);
        
        // Stream API
        list.stream()
            .filter(s -> s.length() > 0)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
    }
    
    // Generic method
    public <T> List<T> genericMethod(T[] array) {
        return Arrays.asList(array);
    }
    
    // Nested class
    private static class NestedClass {
        private int nestedField;
    }
    
    // Inner class
    public class InnerClass {
        public void accessOuter() {
            System.out.println(privateField);
        }
    }
    
    // Enum
    public enum Status {
        ACTIVE("Active"),
        INACTIVE("Inactive");
        
        private final String label;
        
        Status(String label) {
            this.label = label;
        }
        
        public String getLabel() {
            return label;
        }
    }
    
    // Record (Java 16+)
    public record Point(int x, int y) {
        // Compact constructor
        public Point {
            if (x < 0 || y < 0) {
                throw new IllegalArgumentException();
            }
        }
    }
    
    // Sealed class (Java 17+)
    public sealed class Shape 
        permits Circle, Rectangle, Triangle {
        // Class contents
    }
}

// Interface
interface Interface1 {
    void method1();
    default void defaultMethod() {
        System.out.println("Default implementation");
    }
}

// Abstract class
abstract class ParentClass {
    abstract void abstractMethod();
}
