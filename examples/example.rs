// Comprehensive Rust 2024 example covering common and advanced syntax.
#![allow(dead_code, unused_variables, unused_imports, clippy::needless_return)]

// Module system with nested modules and visibility
pub mod math {
	pub mod ops {
		pub fn add(a: i32, b: i32) -> i32 { a + b }
		pub fn sub(a: i32, b: i32) -> i32 { a - b }
	}

	// Use of pub(crate) visibility
	pub(crate) fn secret() -> &'static str { "crate-only" }
}

// Use statement with aliasing
use math::ops::{add as add_i32, sub};

// Constants and statics
pub const PI: f64 = 3.141592653589793;
static mut GLOBAL_COUNTER: usize = 0;

// Traits, trait bounds, and impls with generics and lifetimes
pub trait Summable<T> {
	fn sum(&self) -> T;
}

impl<T> Summable<T> for Vec<T>
where
	T: std::ops::Add<Output = T> + Default + Copy,
{
	fn sum(&self) -> T {
		let mut acc = T::default();
		for &v in self {
			acc = acc + v;
		}
		acc
	}
}

// Structs (named, tuple, unit), enums with data, and pattern matching
#[derive(Debug, Clone)]
pub struct Point<T> {
	pub x: T,
	pub y: T,
}

pub struct Color(u8, u8, u8);
pub struct Unit;

#[derive(Debug)]
pub enum Message {
	Quit,
	Move { x: i32, y: i32 },
	Write(String),
	ChangeColor(Color),
}

// Generic function with where clause and lifetime parameters
pub fn longest<'a>(a: &'a str, b: &'a str) -> &'a str {
	if a.len() >= b.len() { a } else { b }
}

// Closures and iterators
fn closure_examples() {
	let add = |x: i32, y: i32| x + y;
	let v = vec![1, 2, 3, 4];
	let mapped: Vec<i32> = v.iter().map(|&n| add(n, 10)).collect();
	println!("mapped = {:?}", mapped);
}

// Async/await and futures (simple example using async-std or tokio not required here)
async fn async_add(x: i32, y: i32) -> i32 { x + y }

// Macros: defining and using a declarative macro and using format-like macros
macro_rules! my_vec {
	( $( $x:expr ),* $(,)? ) => {
		{
			let mut temp_vec = Vec::new();
			$( temp_vec.push($x); )*
			temp_vec
		}
	};
}

// Procedural macros would normally be in a separate crate; we show attributes instead

// Unsafe code and FFI example (minimal)
extern "C" {
	fn fabs(x: f64) -> f64;
}

unsafe fn call_fabs(x: f64) -> f64 {
	fabs(x)
}

// Use of impl Trait, associated types, and async trait example via manual pattern
pub trait IteratorExt {
	type Item;
	fn next_item(&mut self) -> Option<Self::Item>;
}

impl<T> IteratorExt for std::vec::IntoIter<T> {
	type Item = T;
	fn next_item(&mut self) -> Option<Self::Item> { self.next() }
}

// Pattern matching with guards and bindings
fn match_examples(msg: Message) {
	match msg {
		Message::Quit => println!("Quit received"),
		Message::Move { x, y } if x == 0 && y == 0 => println!("At origin"),
		Message::Write(s) => println!("Write: {}", s),
		Message::ChangeColor(Color(r, g, b)) => println!("Color: {},{},{}", r, g, b),
	}
}

// Iterator and for loop with label
fn loops_and_labels() {
	'outer: for i in 0..3 {
		for j in 0..3 {
			if i == 1 && j == 1 { break 'outer; }
		}
	}
}

// Use of attributes, cfg, and conditional compilation
#[cfg(test)]
mod tests {
	use super::*;

	#[test]
	fn test_add() {
		assert_eq!(add_i32(2, 3), 5);
	}
}

// Impl blocks, inherent and trait impls
impl<T> Point<T> {
	pub fn new(x: T, y: T) -> Self { Self { x, y } }
}

impl Point<f64> {
	pub fn magnitude(&self) -> f64 { (self.x * self.x + self.y * self.y).sqrt() }
}

// Traits with default methods
pub trait Greet {
	fn greet(&self) -> String { String::from("hello") }
}

impl Greet for Point<i32> {
	fn greet(&self) -> String { format!("Point({}, {}) says hi", self.x, self.y) }
}

// Const fn and compile-time evaluation
pub const fn const_add(a: i32, b: i32) -> i32 { a + b }

// Use of serde derives would require external crate; show simple derive usage above.

// Demonstrate Pin, Box, Rc, Arc, Cell, RefCell
use std::cell::RefCell;
use std::rc::Rc;
use std::sync::Arc;

fn smart_pointer_examples() {
	let rc = Rc::new(RefCell::new(5));
	{
		let mut v = rc.borrow_mut();
		*v += 1;
	}
	let arc = Arc::new(10);
	println!("rc/arc examples done: {} {}", rc.borrow(), arc);
}

// Macro usage
fn macro_usage() {
	let v = my_vec![1, 2, 3, 4];
	println!("my_vec = {:?}", v);
}

// Demonstrate building and returning closures (impl Fn)
fn make_adder(x: i32) -> impl Fn(i32) -> i32 { move |y| x + y }

// Example of attribute macros and doc comments
/// Adds two numbers and documents the function.
pub fn documented_add(a: i32, b: i32) -> i32 { a + b }

// Main function showing usage of many items above. Keep small to avoid heavy deps.
#[allow(clippy::print_stdout)]
fn main() {
	println!("Rust 2024 syntax example running");

	// Modules and use
	println!("add: {}", add_i32(10, 20));

	// Structs and enums
	let p = Point::new(3.0f64, 4.0f64);
	println!("Point magnitude = {}", p.magnitude());

	let msg = Message::Write(String::from("hello world"));
	match_examples(msg);

	// Closures and iterators
	closure_examples();

	// Smart pointers
	smart_pointer_examples();

	// Macro
	macro_usage();

	// Generics and traits
	let v: Vec<i32> = vec![1, 2, 3];
	println!("Vec sum = {}", v.sum());

	// Longest
	let s1 = "short";
	let s2 = "much longer";
	println!("Longest = {}", longest(s1, s2));

	// Unsafe global counter increment
	unsafe {
		GLOBAL_COUNTER += 1;
		println!("global counter = {}", GLOBAL_COUNTER);
	}

	// Const fn
	const VALUE: i32 = const_add(2, 3);
	println!("const add = {}", VALUE);

	// Async usage: create a future and poll it synchronously for demo
	let future = async { async_add(4, 6).await };
	let result = futures::executor::block_on(future);
	println!("async add result = {}", result);

	// FFI call (unsafe) — call C's fabs if available; if not, skip
	#[cfg(any(target_os = "linux", target_os = "macos", target_os = "freebsd"))]
	unsafe {
		let f = call_fabs(-3.14);
		println!("fabs(-3.14) = {}", f);
	}
}
