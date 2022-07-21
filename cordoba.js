// The Great Mosque of Cordoba
// https://editor.p5js.org/bgreenlee/sketches/n2j7dIRI1

var screenWidth = window.innerWidth;
var screenHeight = window.innerHeight;
var cellWidth = screenWidth / 10;
var cellHeight = cellWidth; //screenHeight / 10;
var lineWeight = cellWidth / 30;

function setup() {
  createCanvas(screenWidth, screenHeight);
  noFill();
}

function draw() {
  strokeWeight(lineWeight);
  for (let y = 0; y < screenHeight; y += cellHeight) {
    for (let x = 0; x < screenWidth; x += cellWidth) {
      drawCell(x, y, cellWidth, cellHeight);
    }
  }
}

// handle window resizing
window.onresize = function() {
  // assigns new values for width and height variables
  screenWidth = window.innerWidth;
  screenHeight = window.innerHeight;
  resizeCanvas(screenWidth, screenHeight);
  cellWidth = screenWidth / 10;
  cellHeight = cellWidth; //screenHeight / 10;
  lineWeight = cellWidth / 30;
}

// draw an individual cell
function drawCell(xOffset, yOffset, cellWidth, cellHeight) {
    let d = cellWidth;
    let r = d / 2;
    let cx = xOffset + cellWidth / 2;
    let cy = yOffset + cellHeight / 2;

    // construction lines
    // rect(cx - r, cy - r, d, d);
    // circle(cx, cy, d);
    // line(cx - r, cy - r, cx + r, cy + r);
    // line(cx, cy - r, cx, cy + r);
    // line(cx - r, cy + r, cx + r, cy - r);
    // line(cx - r, cy, cx + r, cy);

    // get the eight points on the circle
    var pts = [];
    for (let i = 0; i < 8; i++) {
      pts[i] = pointOnCircle(cx, cy, r, i/4 * PI)
    }

    // generate first set of lines
    let slp = slope(pts[5], pts[0]);
    xLineWithSlopeThroughPoint(slp, pts[5], xOffset, cx);
    xLineWithSlopeThroughPoint(-slp, pts[7], cx, xOffset + cellWidth);
    xLineWithSlopeThroughPoint(-slp, pts[3], xOffset, cx);
    xLineWithSlopeThroughPoint(slp, pts[1], cx, xOffset + cellWidth);

    yLineWithSlopeThroughPoint(1/slp, pts[5], yOffset, cy);
    yLineWithSlopeThroughPoint(-1/slp, pts[3], cy, yOffset + cellHeight);
    yLineWithSlopeThroughPoint(-1/slp, pts[7], yOffset, cy);
    yLineWithSlopeThroughPoint(1/slp, pts[1], cy, yOffset + cellHeight);

    // generate second set of lines
    var p = lineIntersection(
      new Line(pts[4], pts[7]),
      new Line(pts[3], pts[6])
    );
    new Line(pts[4], p).draw();
    new Line(p, pts[6]).draw();

    p = lineIntersection(
      new Line(pts[1], pts[6]),
      new Line(pts[3], pts[7])
    );
    new Line(pts[6], p).draw();
    new Line(p, pts[0]).draw();

    p = lineIntersection(
      new Line(pts[2], pts[7]),
      new Line(pts[1], pts[5])
    );
    new Line(pts[2], p).draw();
    new Line(p, pts[0]).draw();

    p = lineIntersection(
      new Line(pts[1], pts[4]),
      new Line(pts[2], pts[5])
    );
    new Line(pts[2], p).draw();
    new Line(p, pts[4]).draw();

}


class Point {
  constructor(x,y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  draw() {
    line(this.start.x, this.start.y, this.end.x, this.end.y);
  }
}

// return the coordinates of the point on the given circle at the given angle
function pointOnCircle(cx, cy, radius, angle) {
  return new Point(
    cx + radius * cos(angle),
    cy + radius * sin(angle)
  );
}

function slope(p1, p2) {
  return (p2.y - p1.y) / (p2.x - p1.x);
}

// draw a line with the given slope, through the given point, with start and end x-coordinates
function xLineWithSlopeThroughPoint(slp, p, sx, ex) {
  let sy = p.y - (p.x - sx) * slp;
  let ey = p.y + (ex - p.x) * slp;
  line(sx, sy, ex, ey);
}

// draw a line with the given slope, through the given point, with start and end y-coordinates
function yLineWithSlopeThroughPoint(slp, p, sy, ey) {
  let sx = p.x - (p.y - sy) / slp;
  let ex = p.x + (ey - p.y) / slp;
  line(sx, sy, ex, ey);
}

// calculate the intersection of two lines
// from https://en.wikipedia.org/wiki/Line–line_intersection#Given_two_points_on_each_line
function lineIntersection(l1, l2) {
  let x1 = l1.start.x; let y1 = l1.start.y;
  let x2 = l1.end.x;   let y2 = l1.end.y;
  let x3 = l2.start.x; let y3 = l2.start.y;
  let x4 = l2.end.x;   let y4 = l2.end.y;

  let denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (denominator === 0) {
    // lines are parallel
    return null;
  }

  let px = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / denominator;
  let py = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / denominator;
  return new Point(px, py);
}
