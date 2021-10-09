export interface User {
  email: string,
  password: string
}

export interface TopMenuItem {
  title: string,
  href: string,
  active?: boolean
}

export interface HeaderNavButton {
  title: string,
  icon_name: string,
  href: string
}

export interface FooterLink {
  title: string,
  href: string
}
