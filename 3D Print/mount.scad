$fn = 200;

rotate([0, 28, 0]) {
difference () {
    cube([83, 137, 10]); // the base
    
    translate([83/2, 137/2, -10]) {
        translate([62/2, 65/2, 0])
            cylinder(30, 3, 3);
        translate([-62/2, -65/2, 0])
            cylinder(30, 3, 3);
        translate([62/2, -65/2, 0])
            cylinder(30, 3, 3);
        translate([-62/2, 65/2, 0])
            cylinder(30, 3, 3);
    }
}  

difference () {
    translate([0, 137/2-25, 0])
        cube([83, 50, 130]);

    translate([15, 137/2, 30])
        rotate([0, 90-28, 0])
        cylinder(300, 32.5/2, 32.5/2);

    translate([0, 137/2-25-1, 80])
        rotate([0, -28, 0])
        cube([100, 52, 50]);
   
}

    color("green") {
        translate([15, 137/2, 30])
            rotate([0, 90-28, 0])
            cylinder(300, 32.5/2, 32.5/2);
        translate([500, 137/2+32.5, -400])
            rotate([0, -28, 0])
            cylinder(1200, 15, 15);
    }
}




//translate([83+20, 0, 70-30])
//rotate([0, 0, 90])
//cube([137, 60, 60]);

// lets build a yagi
//translate([100, 137/2, -270])
//rotate([0, 0, 0])
//cylinder(1200, 15, 15);