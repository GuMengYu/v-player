import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  Divider,
  IconButton,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import ReloadIcon from '@mui/icons-material/QrCode2'
import { useTranslation } from 'react-i18next'
import {
  checkQRCodeStatus,
  createQRCode,
  getQrCodeKey,
} from '@/api/account'
import { useAppStore } from '@/store/app'
import { useUserStore } from '@/store/user'

enum LOGIN_TYPE {
  ACCOUNT,
  QRCODE,
}

enum QR_STATUS {
  EXPIRED = 800,
  WAIT = 801,
  SCANNED = 802,
  AUTHED = 803,
}

function LoginDialog() {
  const { showLogin: open, toggleLogin } = useAppStore()
  const { refreshAccount, fetchAccount } = useUserStore()
  const { t } = useTranslation()
  const theme = useTheme()

  const [qrStatus, setQrStatus] = useState(QR_STATUS.WAIT)
  const [qrState, setQrState] = useState({
    qrImageSrc: '',
    qrHeadImage: '',
    qrNickName: '',
  })
  const [loginState, setLoginState] = useState({
    phone: '',
    password: '',
    loginType: LOGIN_TYPE.QRCODE,
  })
  const [loggging, setLogging] = useState(false)
  let qrTimer: NodeJS.Timeout | null = null

  useEffect(() => {
    if (open)
      genCode()

    return () => {
      clearTimer()
    }
  }, [open])

  const qrTips = useMemo(() => {
    return (
      {
        [QR_STATUS.WAIT]: [t`message.qr_status_1`],
        [QR_STATUS.SCANNED]: [t`message.qr_status_2`],
        [QR_STATUS.AUTHED]: [t`message.qr_status_3`],
        [QR_STATUS.EXPIRED]: [t`message.qr_status_4`],
      }[qrStatus] ?? ['', '']
    )
  }, [qrStatus])

  async function genCode() {
    console.log('generator qr code image')
    const { data } = await getQrCodeKey()
    const { data: { qrimg } = {}, code } = await createQRCode(data.unikey)
    if (code === 200 && qrimg) {
      setQrStatus(QR_STATUS.WAIT)
      setQrState(qrState => ({
        ...qrState,
        qrImageSrc: qrimg,
      }))
      console.log(qrState, qrimg)
      // state.loginType = LOGIN_TYPE.QRCODE
      // state.qrState = QR_STATUS.WAIT
      // state.qrImageSrc = qrimg
      checkQrStatus(data.unikey)
    }
    else {
      console.log('generate qrcode failed')
      // state.loginType = LOGIN_TYPE.ACCOUNT
    }
  }
  function checkQrStatus(key: string) {
    if (!key)
      return

    qrTimer = setInterval(async () => {
      try {
        await checkQRCodeStatus(key)
      }
      catch (e) {
        interface codeStatus {
          code: number
          avatarUrl: string
          nickname: string
        }
        const { code, avatarUrl = '', nickname = '' } = e as codeStatus
        if (code === QR_STATUS.EXPIRED) {
          setQrStatus(QR_STATUS.EXPIRED)
          await genCode() // 重新生成QrCode
        }
        else if (code === QR_STATUS.WAIT) {
          setQrStatus(QR_STATUS.WAIT)
        }
        else if (code === QR_STATUS.SCANNED) {
          setQrStatus(QR_STATUS.SCANNED)
          setQrState(state => ({
            ...state,
            qrHeadImage: avatarUrl,
            qrNickName: nickname,
          }))
        }
        else if (code === QR_STATUS.AUTHED) {
          setQrStatus(QR_STATUS.AUTHED)
          clearTimer()
          refreshAccount()
          fetchAccount()
          // await userStore.refreshAccount()
          // await userStore.fetch()
          handleClose()
        }
      }
    }, 2000)
  }
  function clearTimer() {
    if (qrTimer) {
      clearInterval(qrTimer)
      qrTimer = null
    }
  }

  function handleClose() {
    clearTimer()
    toggleLogin(false)
  }
  const Md3Dialog = styled(Dialog)(({ theme }) => ({
    '& .MuiPaper-root': {
      borderRadius: 24,
    },
  }))

  return (
    <Md3Dialog onClose={handleClose} open={open}>
      <Card
        sx={{
          minWidth: 340,
          padding: 2,
          bgcolor: theme.palette.surfaceVariant.main,
          color: theme.palette.onSurfaceVariant.main,
        }}
      >
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography variant="h6">{t`common.sign_in`}</Typography>
            <Typography variant="caption">
              {t`message.login`}
            </Typography>
          </Box>
          <Card
            sx={{
              height: 160,
              width: 160,
              background: `url(${qrState.qrImageSrc})`,
              backgroundSize: 'cover',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            variant="outlined"
          >
            {qrStatus === QR_STATUS.SCANNED
              ? (
              <>
                <CircularProgress
                  sx={{
                    position: 'absolute',
                  }}
                  size={110}
                  thickness={1}
                  color="secondary"
                ></CircularProgress>{' '}
                <Avatar
                  sx={{ width: 100, height: 100 }}
                  src={qrState.qrHeadImage}
                ></Avatar>
              </>
                )
              : (
                  ''
                )}
            {
              qrStatus === QR_STATUS.EXPIRED ? <IconButton onClick={() => genCode()}><ReloadIcon/></IconButton> : ''
            }

            {/* <CardMedia component='img' image={qrState.qrImageSrc}></CardMedia> */}
          </Card>
          <Typography variant="caption">{qrTips[0]}</Typography>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'end' }}>
          <Button onClick={handleClose}>{t`common.cancel`}</Button>
        </CardActions>
      </Card>
    </Md3Dialog>
  )
}

export default LoginDialog
