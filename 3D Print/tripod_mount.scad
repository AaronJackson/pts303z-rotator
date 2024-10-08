$fn = 200;

tube_dia = 35;

// The base
difference() {
    union () {
        cylinder(10, 150/2+10, 150/2+10);
        translate([0, 0, -40])
            cylinder(40, (tube_dia+10)/2, (tube_dia+10)/2+30);
    }
    
    translate([0, 0, -50])
        cylinder(80, tube_dia/2, tube_dia/2);
    
    translate([0, 0, -1])
    for (t = [0:90:360]) {
        rotate([0, 0, t])
            translate([135/2, 0, 0])
            cylinder(30, 3, 3);
    }
}

