import type { IconifyName } from 'src/components/iconify';

import { useTranslation } from 'react-i18next';

import { Box, Card, Link, Stack, Divider, Tooltip, IconButton, Typography } from '@mui/material';

import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';

import Title from 'src/components/title';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------
// Tab "Liên hệ" (thay tab File). Nội dung giống trang /help của bản web
// (../book.anhtester.com/frontend/src/pages/help/page.tsx), lấy từ https://anhtester.com/contact.
// Đổi thông tin thì sửa các mảng CONTACTS, SOCIALS, COMMUNITIES và báo bên web sửa theo.

type ContactItem = {
  id: string;
  label: string;
  value: string;
  href: string;
  icon: IconifyName;
  color: string;
};

const CONTACTS: ContactItem[] = [
  {
    id: 'phone',
    label: 'contact.info.phone',
    value: '0939 206 009',
    href: 'tel:0939206009',
    icon: 'solar:phone-bold',
    color: '#42BC40',
  },
  {
    id: 'email',
    label: 'contact.info.email',
    value: 'thaian.it15@gmail.com',
    href: 'mailto:thaian.it15@gmail.com',
    icon: 'solar:letter-bold',
    color: '#EA4335',
  },
  {
    id: 'zalo',
    label: 'contact.info.zalo',
    value: 'zalo.me/0939206009',
    href: 'https://zalo.me/0939206009',
    icon: 'simple-icons:zalo',
    color: '#0068FF',
  },
  {
    id: 'website',
    label: 'contact.info.website',
    value: 'anhtester.com',
    href: 'https://anhtester.com',
    icon: 'solar:global-bold',
    color: '#E86A1A',
  },
];

type SocialItem = { id: string; name: string; href: string; icon: IconifyName; color: string };

const SOCIALS: SocialItem[] = [
  {
    id: 'facebook',
    name: 'Facebook',
    href: 'https://facebook.com/anhtester',
    icon: 'ri:facebook-circle-fill',
    color: '#1877F2',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    href: 'https://youtube.com/@anhtester',
    icon: 'ri:youtube-fill',
    color: '#FF0000',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    href: 'https://t.me/anhtester',
    icon: 'ri:telegram-fill',
    color: '#26A5E4',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/anhtester',
    icon: 'ri:linkedin-box-fill',
    color: '#0A66C2',
  },
  {
    id: 'github',
    name: 'GitHub',
    href: 'https://github.com/anhtester',
    icon: 'ri:github-fill',
    color: 'currentColor',
  },
  {
    id: 'discord',
    name: 'Discord',
    href: 'https://discord.gg/pzendtpJnt',
    icon: 'ri:discord-fill',
    color: '#5865F2',
  },
];

type CommunityItem = {
  id: string;
  platform: string;
  name: string;
  href: string;
  icon: IconifyName;
  color: string;
};

const COMMUNITIES: CommunityItem[] = [
  {
    id: 'zalo-automation',
    platform: 'Zalo',
    name: 'contact.community.automation',
    href: 'https://zalo.me/g/lsxswc560',
    icon: 'simple-icons:zalo',
    color: '#0068FF',
  },
  {
    id: 'zalo-manual',
    platform: 'Zalo',
    name: 'contact.community.manual',
    href: 'https://zalo.me/g/mmwgnt932',
    icon: 'simple-icons:zalo',
    color: '#0068FF',
  },
  {
    id: 'facebook-automation',
    platform: 'Facebook',
    name: 'contact.community.automation',
    href: 'https://www.facebook.com/groups/automationtest',
    icon: 'ri:facebook-circle-fill',
    color: '#1877F2',
  },
  {
    id: 'facebook-manual',
    platform: 'Facebook',
    name: 'contact.community.manual',
    href: 'https://www.facebook.com/groups/manualtest',
    icon: 'ri:facebook-circle-fill',
    color: '#1877F2',
  },
  {
    id: 'facebook-playwright',
    platform: 'Facebook',
    name: 'contact.community.playwright',
    href: 'https://www.facebook.com/groups/playwrightvietnam',
    icon: 'ri:facebook-circle-fill',
    color: '#1877F2',
  },
  {
    id: 'facebook-jobs',
    platform: 'Facebook',
    name: 'contact.community.jobs',
    href: 'https://www.facebook.com/groups/testerclub',
    icon: 'ri:facebook-circle-fill',
    color: '#1877F2',
  },
  {
    id: 'telegram-automation',
    platform: 'Telegram',
    name: 'contact.community.automation',
    href: 'https://t.me/+kSUGJ3pVvxkyZWU1',
    icon: 'ri:telegram-fill',
    color: '#26A5E4',
  },
  {
    id: 'telegram-manual',
    platform: 'Telegram',
    name: 'contact.community.manual',
    href: 'https://t.me/+8eChRz7OVqliZWRl',
    icon: 'ri:telegram-fill',
    color: '#26A5E4',
  },
];

/**
 * Link ra ngoài: tel/mailto mở ứng dụng gọi/thư; http(s) mở tab mới. Trong app Capacitor,
 * WebView không mở cửa sổ mới nên link http(s) đi qua shouldOverrideUrlLoading và mở bằng
 * trình duyệt / app ngoài (Zalo, Facebook…).
 */
const externalProps = (href: string) =>
  href.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {};

// ----------------------------------------------------------------------

export default function ContactPage() {
  const { t } = useTranslation();

  const renderSectionTitle = (title: string) => (
    <Typography variant="overline" component="h2" sx={{ color: 'text.secondary', mb: 1.5 }}>
      {title}
    </Typography>
  );

  return (
    <DashboardContent>
      <Title>{`${t('contact.title')} - ${CONFIG.appName}`}</Title>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 1 }}>
          {t('contact.title')}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {t('contact.description')}
        </Typography>
      </Box>

      <Card sx={{ p: { xs: 2, sm: 3 } }}>
        <Box component="section" aria-label={t('contact.info.title')}>
          {renderSectionTitle(t('contact.info.title'))}
          <Stack spacing={1.5}>
            {CONTACTS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                underline="none"
                color="inherit"
                data-testid={`contact-info-${item.id}`}
                {...externalProps(item.href)}
                sx={(theme) => ({
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 1.5,
                  border: `1px solid ${theme.vars.palette.divider}`,
                  transition: theme.transitions.create(['background-color', 'border-color']),
                  '&:hover': {
                    bgcolor: theme.vars.palette.action.hover,
                    borderColor: theme.vars.palette.text.disabled,
                  },
                })}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    flexShrink: 0,
                    display: 'flex',
                    borderRadius: '50%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: item.color,
                    bgcolor: `${item.color}1F`,
                  }}
                >
                  <Iconify icon={item.icon} width={22} />
                </Box>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                    {t(item.label)}
                  </Typography>
                  <Typography variant="subtitle1" noWrap>
                    {item.value}
                  </Typography>
                </Box>
              </Link>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Box component="section" aria-label={t('contact.social.title')}>
          {renderSectionTitle(t('contact.social.title'))}
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {SOCIALS.map((item) => (
              <Tooltip key={item.id} title={item.name}>
                <IconButton
                  component="a"
                  href={item.href}
                  aria-label={item.name}
                  data-testid={`contact-social-${item.id}`}
                  {...externalProps(item.href)}
                  // 44dp: đủ để chạm và vừa 6 nút trên một hàng ở màn 360dp
                  sx={{ width: 44, height: 44, color: item.color, border: 1, borderColor: 'divider' }}
                >
                  <Iconify icon={item.icon} width={24} />
                </IconButton>
              </Tooltip>
            ))}
          </Box>
        </Box>

        <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

        <Box component="section" aria-label={t('contact.community.title')}>
          {renderSectionTitle(t('contact.community.title'))}
          <Box
            sx={{
              columnGap: 2,
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            }}
          >
            {COMMUNITIES.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                color="inherit"
                underline="hover"
                data-testid={`contact-community-${item.id}`}
                {...externalProps(item.href)}
                // Cao tối thiểu 44dp cho dễ chạm trên điện thoại
                sx={{
                  gap: 1.5,
                  minHeight: 44,
                  display: 'flex',
                  alignItems: 'center',
                  typography: 'body2',
                }}
              >
                <Iconify icon={item.icon} width={22} sx={{ color: item.color, flexShrink: 0 }} />
                {`${item.platform} · ${t(item.name)}`}
              </Link>
            ))}
          </Box>
        </Box>
      </Card>
    </DashboardContent>
  );
}
