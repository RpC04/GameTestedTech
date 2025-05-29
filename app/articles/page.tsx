import ArticlesClient from "./articles-client"
import "react-datepicker/dist/react-datepicker.css"

export const metadata = {
  title: "Articles - Game Tested Tech",
  description: "Discover the latest gaming articles, reviews, and technical insights from Game Tested Tech.",
}

export default function ArticlesPage() {
  return <ArticlesClient />
}