let str = string_of_int
let int = int_of_string

let rec nos = i => {
  switch i {
  | 0 => list{0}
  | n => list{n, ...nos(i - 1)}
  }
}

let rec split = (s, c) => {
  switch String.index(s, c) {
  | exception Not_found => list{s}
  | n =>
    let m1 = String.sub(s, 0, n)
    switch String.sub(s, n + 1, String.length(s) - n - 1) {
    | exception Invalid_argument(_) => list{m1}
    | m2 => m1 == "" ? split(m2, c) : list{m1, ...split(m2, c)}
    }
  }
}

let rec index = (a, xs) => index'(a, xs, 0)
and index' = (a, xs, n) => {
  switch xs {
  | list{} => raise(Not_found)
  | list{x, ...xs} => x == a ? n : index'(a, xs, n + 1)
  }
}

let rec zip = (xs, ys) => {
  switch (xs, ys) {
  | (list{}, list{}) => list{}
  | (list{x, ...xs}, list{y, ...ys}) => list{(x, y), ...zip(xs, ys)}
  | _ => failwith("Lists not same length")
  }
}

let rec contains = (a, xs) => {
  switch xs {
  | list{} => false
  | list{x, ...xs} => x == a ? true : contains(a, xs)
  }
}

let rec print_list' = (xs, f) => {
  switch xs {
  | list{} => ", "
  | list{x, ...xs} => f(x) ++ "," ++ print_list'(xs, f)
  }
}

let print_list = (xs, f) => {
  let printed = print_list'(xs, f)
  "[" ++ String.sub(printed, 0, String.length(printed) - 3) ++ "]"
}

let lists_equal = (xs, ys) => List.fold_left2((acc, x, y) => x == y && acc, true, xs, ys)
