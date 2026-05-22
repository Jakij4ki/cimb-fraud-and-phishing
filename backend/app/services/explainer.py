from app.services.whitelist_checker import WhitelistResult

def generate_explanation(
    score: int,
    risk_level: str,
    whitelist_result: WhitelistResult,
    nlp_result: dict,
    typosquatting_alerts: list
) -> str:
    
    explanations = []

    # Check Typosquatting
    if typosquatting_alerts:
        explanations.append(
            "Link dalam pesan ini sangat mirip dengan link bank asli, tapi berbeda. "
            "Penipu sengaja membuat link hampir sama untuk mengelabui. "
            "Jangan klik link tersebut dan jangan berikan data apapun."
        )

    # Check Whitelist
    if whitelist_result.has_unknown_component:
        explanations.append(
            "Link atau kontak dalam pesan ini bukan milik bank resmi. "
            "Bank tidak pernah meminta konfirmasi melalui saluran tidak resmi seperti ini."
        )

    # Check NLP
    if nlp_result.get("is_phishing", False):
        explanations.append(
            "Pesan ini menggunakan kata-kata yang sengaja membuat Anda panik atau terburu-buru. "
            "Ini adalah ciri khas penipuan."
        )

    # Check Safe
    if not explanations and risk_level == "safe":
        explanations.append(
            "Pesan ini tidak menunjukkan tanda-tanda penipuan yang jelas. "
            "Tetap waspada dan jangan sembarangan memberikan data pribadi."
        )

    # Join and trim to max 3 sentences if needed
    final_explanation = " ".join(explanations)
    
    sentences = final_explanation.split(". ")
    if len(sentences) > 3:
        # Re-join max 3
        final_explanation = ". ".join(sentences[:3])
        if not final_explanation.endswith("."):
            final_explanation += "."

    return final_explanation
