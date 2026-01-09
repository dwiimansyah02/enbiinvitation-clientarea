import { GuestData } from '../../utils/fetchGuest';

export const handleWhatsapp = async (
  guest: GuestData,
) => {
  if (!guest.phone || !guest?.client_url) return;

    // Normalize phone number: 08xxx → 62xxx
    let phone = guest.phone.trim();
    if (phone.startsWith("0")) {
      phone = "62" + phone.slice(1);
    }

    const baseUrl = "https://api.whatsapp.com/send";
    const invitationUrl = `https://khitan.enbiinvitation.com/${guest.client_url}`;
    const to = guest.name;

    const encodedInvitationUrl = `${invitationUrl}?to=${encodeURIComponent(to)}`;

  const text = [
    "_Assalamualaikum Warahmatullahi Wabarakatuh_",
    "",
    `Tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Saudara/i *${guest.name}* untuk menghadiri acara kami.`,
    "",
    "*Berikut link undangan kami*, untuk info lengkap dari acara bisa kunjungi :",
    "",
    encodedInvitationUrl,
    "",
    "Merupakan suatu kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan untuk hadir dan memberikan kepada anak kami dalam acara khitan anak kami.",
    "",
    "*Mohon maaf perihal undangan hanya di bagikan melalui pesan ini.*",
    "",
    "Terima kasih banyak atas perhatiannya.",
    "",
    "_Wassalamualaikum Warahmatullahi Wabarakatuh_",
  ].join("\n");

    const fullUrl =
      `${baseUrl}?phone=${phone}&text=${encodeURIComponent(text)}`;

    window.open(fullUrl, "_blank");
};
