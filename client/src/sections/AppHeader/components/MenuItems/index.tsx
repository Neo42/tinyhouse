import {Avatar, Button, Menu} from 'antd'
import {HomeOutlined, LogoutOutlined, UserOutlined} from '@ant-design/icons'
import {Link, useNavigate} from 'react-router-dom'
import {useMutation} from '@apollo/client'
import {LOG_OUT, LogOut as LogOutData} from 'lib/graphql/mutations'
import {Viewer} from 'lib/types'
import {displayErrorMessage, displaySuccessNotification} from 'lib/utils'

const {Item, SubMenu} = Menu

interface Props {
  viewer: Viewer
  setViewer: (viewer: Viewer) => void
}

export const MenuItems = ({viewer, setViewer}: Props) => {
  const navigate = useNavigate()
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut)
        sessionStorage.removeItem('token')
        displaySuccessNotification("You've successfully logged out!")
      }
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to log you out. Please try again later!",
      )
    },
  })

  const handleLogOut = () => {
    logOut()
    navigate('/login')
  }

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu title={<Avatar src={viewer.avatar} />} key="/user">
        <Item key="/profile">
          <Link to={`/user/${viewer.id}`}>
            <UserOutlined /> Profile
          </Link>
        </Item>
        <Item key="/logout">
          <div onClick={handleLogOut}>
            <LogoutOutlined /> Logout
          </div>
        </Item>
      </SubMenu>
    ) : (
      <Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    )

  return (
    <Menu mode="horizontal" selectable={false} className="menu">
      <Item key="/host">
        <Link to="/host">
          <HomeOutlined /> Host
        </Link>
      </Item>
      {subMenuLogin}
    </Menu>
  )
}
