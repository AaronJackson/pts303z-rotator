$fn = 200;
difference() {
    cylinder(15, 29/2, 29/2);
    translate([0, 0, -1])
        cylinder(15, 29/2-1, 29/2-1);
}

translate([0, 0, 15])
    cylinder(2, 32.5/2, 32.5/2);