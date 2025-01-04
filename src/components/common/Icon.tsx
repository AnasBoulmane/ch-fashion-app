/**
 * Icon component to display google material icons
 * @param props
 * @returns
 */
export function Icon(props: { name: string; className?: string }) {
  return <i className={`material-symbols-rounded ${props.className}`}>{props.name}</i>
}
