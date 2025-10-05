import { Link as RRLink, useInRouterContext } from 'react-router-dom'

export default function SafeLink({ to, children, ...rest }) {
  const inRouter = useInRouterContext()
  if (!inRouter) return <a href={typeof to === 'string' ? to : '#'} {...rest}>{children}</a>
  return <RRLink to={to} {...rest}>{children}</RRLink>
}
