import { GuestData } from '../../utils/fetchGuest';

export const handleCopy = async (
  guest: GuestData,
  presentToast: (options: any) => void
) => {
  if (!guest) return;

  const invitationUrl = `https://khitan.enbiinvitation.com/${guest.client_url}`;
  const encodedInvitationUrl =
    `${invitationUrl}?to=${encodeURIComponent(guest.name)}`;

  const text = [
    "_Assalamualaikum Warahmatullahi Wabarakatuh_",
    "",
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guest.name}* untuk menghadiri acara kami.`,
    "",
    "*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi :",
    "",
    encodedInvitationUrl,
    "",
    "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan doa restu kepada anak kami dalam acara khitan anak kami.",
    "",
    "*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*",
    "",
    "Terima kasih banyak atas perhatiannya.",
    "",
    "_Wassalamualaikum Warahmatullahi Wabarakatuh_",
  ].join("\n");

  try {
    await navigator.clipboard.writeText(text);
    presentToast({
      message: 'Teks undangan berhasil disalin',
      duration: 1500,
      position: 'top',
    });
  } catch (error) {
    presentToast({
      message: 'Gagal menyalin teks',
      color: 'danger',
      duration: 1500,
      position: 'top',
    });
  }
};
