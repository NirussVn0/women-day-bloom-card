import { fetchCard } from "@/lib/actions"
import { CardView } from "@/components/card/CardView"
import { notFound } from "next/navigation"
import { Metadata } from "next"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const card = await fetchCard(id)
  
  return {
    title: card ? `Lời chúc cho ${card.recipientName} ✿` : "WishLink 8/3",
    description: card ? "Ai đó đã gửi cho bạn một bất ngờ ngày 8/3!" : "Không tìm thấy thiệp.",
    openGraph: {
      title: card ? `🌷 ${card.recipientName}, bạn có bất ngờ!` : "WishLink 8/3",
      description: "Mở ra để xem lời chúc đặc biệt dành cho bạn ✿",
    },
  }
}

export default async function CardPage({ params }: Props) {
  const { id } = await params
  const card = await fetchCard(id)

  if (!card) {
    notFound()
  }

  return <CardView recipientName={card.recipientName} message={card.message} />
}
