import {Alert, Divider, Skeleton} from 'antd'
import './styles/ListingsSkeleton.css'

interface Props {
  title: string
  error?: boolean
}

export const ListingsSkeleton = ({title, error = false}: Props) => {
  return (
    <div className="listings-skeleton">
      {error ? (
        <Alert
          type="error"
          message="Uh oh! Somethings went wrong - Please try again later... :()"
          className="listings-skeleton__alert"
        />
      ) : null}
      <h2>{title}</h2>
      <Skeleton active paragraph={{rows: 1}} />
      <Divider />
      <Skeleton active paragraph={{rows: 1}} />
      <Divider />
      <Skeleton active paragraph={{rows: 1}} />
    </div>
  )
}
