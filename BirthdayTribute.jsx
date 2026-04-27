import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Mail, Volume2, VolumeX, Star, Sparkles } from "lucide-react";

// ============================================================
// 🎨 CUSTOMIZATION ZONE — swap these out easily!
// ============================================================
const CONFIG = {
    PIN: "2804", // Change to your 4-digit pin
    birthdayName: "Best Mom", // Name shown in header
    candleCount: 4, // Number of candles on the cake
    wishMessage: "Home is wherever you are. Happy Birthday to my favorite person in the whole world. 🌸",

    // 3 gift messages — swap text or add image URLs
    gifts: [
        {
            emoji: "💌",
            title: "A Little Note",
            message:
                "Every good thing in me started with you. Thank you for your endless love, your sacrifices, and your smile that makes every hard day easier. Happy Birthday, Mama.",
            color: "#ffd6e7",
        },
        {
            emoji: "🌸",
            title: "A Promise",
            message:
                "I promise that i'll always be the bright son you always wanted.",
            color: "#d6eaff",
        },
        {
            emoji: "✨",
            title: "A Memory",
            message:
                "The memories are endless, but the one that always makes me smile is that you still look out for me like a child.",
            color: "#e8d6ff",
        },
        {
            emoji: "🫂",
            title: "A Hug",
            message:
                "Sending you the biggest, warmest hug right now. Love you sooo much amma. ",
            color: "#ffe0d6",
        },
        {
            emoji: "🌍",
            title: "My World",
            message:
                "You are my entire world. Thank you for making my life so incredibly beautiful.",
            color: "#d6ffe0",
        },
    ],

    // Photo strip — replace with your actual image URLs
    photos: [
        "pranav.png",
        "amma4.jpg",
        "amma3.JPG",
        "amma1.jpg",
        "amma.jpg",
    ],

    // The heartfelt letters inside the envelopes
    letters: [
        `Dearest Amma,

They say home isn’t a place, it’s a person—and for me, that has always been you.

As I look back at my life, I realize how much of "me" is just a reflection of you. Thank you for your endless patience, your quiet sacrifices, and for being the steady hand that keeps our world running smoothly.

You are my greatest teacher. On your birthday, I want to make three promises:

1. I promise to always make time for us, no matter how busy life gets.

2. I promise to always be the son that makes you proud.

3. I promise to always be there for you no matter what.

Thank you for being my rock and my biggest cheerleader. You deserve all the joy in the world.
Be happy just like in this image....    

Once again,Happy Birthday, Ma. I love you more than words can say.

With all my love,
Pranav 💕`
    ],
    sonSection: {
        photo: "pranav2.jpg",
        letter: `Neke Akka,

pina rasindhi antha Gemini nenu kadu so serious ga tiskoku 😂.
so matter enti ante nuv ante nak istame akka but nen eppudu cheppanu ante i rather show how much i love when time comes like madhu maya 😎.

Akka life lo ekkuva stress tiskokudadhu life okka sari eh vastundhi ah chinna life lo kuda endhuku cheppu stress 41 ochai inka chalu nuvu ni medha focus cheyu🔥.
And ekkuv matladaku akka mari edo matalu karuvu la behave chesthunav oka 50 yrs taravatha matladinattu 😒.
Trust in God's plan nek cheppakkarle nuvve oka diva dhutha vi so inkem undhi ninnu nuvu chusko, happy ga undu 😊, entha sepu alochinchalo kadu eppudu apalo telisina vadu goppa ela echam😎.
Life ni peaceful ga lead cheyadam nerchuko na laga. Ekkuva anni pattinchukoku eppudu em cheppalo appudu cheppu.
Love you ma ❤️😘

Mi abbai,
Vnekat Pranav.🌺`
    },
};
// ============================================================

// ---- Floating hearts background ----
function FloatingHearts() {
    const hearts = Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 8,
        duration: 6 + Math.random() * 6,
        size: 10 + Math.random() * 16,
        opacity: 0.15 + Math.random() * 0.25,
    }));

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {hearts.map((h) => (
                <motion.div
                    key={h.id}
                    className="absolute text-pink-300"
                    style={{ left: h.left, bottom: "-40px", fontSize: h.size, opacity: h.opacity }}
                    animate={{ y: [0, -window.innerHeight - 60] }}
                    transition={{
                        duration: h.duration,
                        delay: h.delay,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                >
                    ♥
                </motion.div>
            ))}
        </div>
    );
}

// ---- Confetti burst ----
function Confetti({ active }) {
    const pieces = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 600,
        y: -(Math.random() * 400 + 100),
        rotate: Math.random() * 720 - 360,
        color: ["#ffc0cb", "#ffb3d9", "#c9b8ff", "#b8d8ff", "#b8ffda", "#ffe4b8"][
            Math.floor(Math.random() * 6)
        ],
        size: 6 + Math.random() * 8,
    }));

    return (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <AnimatePresence>
                {active &&
                    pieces.map((p) => (
                        <motion.div
                            key={p.id}
                            className="absolute rounded-sm"
                            style={{ width: p.size, height: p.size, backgroundColor: p.color }}
                            initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                            animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.rotate }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.4, ease: "easeOut" }}
                        />
                    ))}
            </AnimatePresence>
        </div>
    );
}

// ---- PIN Gate ----
function PinGate({ onUnlock }) {
    const [pin, setPin] = useState(["", "", "", ""]);
    const [error, setError] = useState(false);
    const [shake, setShake] = useState(false);
    const refs = [useRef(), useRef(), useRef(), useRef()];

    const handleKey = (i, val) => {
        if (!/^\d?$/.test(val)) return;
        const next = [...pin];
        next[i] = val;
        setPin(next);
        setError(false);
        if (val && i < 3) refs[i + 1].current?.focus();
        if (next.every((d) => d !== "") && val) {
            const code = next.join("");
            if (code === CONFIG.PIN) {
                onUnlock();
            } else {
                setError(true);
                setShake(true);
                setTimeout(() => {
                    setPin(["", "", "", ""]);
                    setShake(false);
                    refs[0].current?.focus();
                }, 700);
            }
        }
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col items-center justify-center px-4"
            style={{ background: "linear-gradient(135deg, #fff0f5 0%, #fce4f0 50%, #f0e4ff 100%)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <FloatingHearts />
            <motion.div
                className="relative z-10 bg-white/80 backdrop-blur-sm rounded-3xl p-10 shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full"
                style={{ border: "2px solid #ffd6e7" }}
                animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
                transition={{ duration: 0.4 }}
            >
                <motion.div
                    className="text-6xl"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ repeat: Infinity, duration: 2.5 }}
                >
                    🔐
                </motion.div>
                <div className="text-center">
                    <h1
                        className="text-3xl font-bold text-pink-400 mb-1"
                        style={{ fontFamily: "'Georgia', serif", letterSpacing: "-0.5px" }}
                    >
                        For You, Amma!
                    </h1>
                    <p className="text-pink-300 text-sm">Enter the secret pin to continue ✨</p>
                </div>

                <div className="flex gap-3">
                    {pin.map((d, i) => (
                        <input
                            key={i}
                            ref={refs[i]}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleKey(i, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Backspace" && !pin[i] && i > 0) refs[i - 1].current?.focus();
                            }}
                            className={`w-14 h-14 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all
                ${error ? "border-red-300 bg-red-50" : "border-pink-200 bg-pink-50 focus:border-pink-400 focus:bg-white"}`}
                            style={{ color: "#e879a0" }}
                        />
                    ))}
                </div>

                {error && (
                    <motion.p
                        className="text-red-400 text-sm"
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Hmm, that's not right 💔 Try again!
                    </motion.p>
                )}

                <p className="text-pink-200 text-xs">Hint: it's our special number 🌸</p>
            </motion.div>
        </motion.div>
    );
}

// ---- Cake & Wishes Section ----
function WishSection() {
    const [blown, setBlown] = useState(false);
    const [confetti, setConfetti] = useState(false);

    const blow = () => {
        if (blown) return;
        setBlown(true);
        setConfetti(true);
        setTimeout(() => setConfetti(false), 1500);
    };

    return (
        <section className="relative flex flex-col items-center gap-6 py-12">
            <Confetti active={confetti} />
            <motion.h2
                className="text-3xl font-bold text-pink-400 text-center"
                style={{ fontFamily: "'Georgia', serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Make a Wish 🎂
            </motion.h2>

            {/* Cake */}
            <motion.div
                className="relative select-none"
                whileHover={{ scale: 1.02 }}
            >
                {/* Candles */}
                <div className="flex justify-center gap-3 mb-1">
                    {Array.from({ length: CONFIG.candleCount }).map((_, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <AnimatePresence>
                                {!blown && (
                                    <motion.div
                                        className="text-xl"
                                        initial={{ opacity: 1 }}
                                        exit={{ opacity: 0, y: -10, scale: 0.5 }}
                                        transition={{ duration: 0.3, delay: i * 0.06 }}
                                    >
                                        🔥
                                    </motion.div>
                                )}
                            </AnimatePresence>
                            <div
                                className="w-3 rounded-t-full"
                                style={{
                                    height: 28,
                                    background: ["#ffb3d9", "#b3d4ff", "#c4b3ff", "#b3ffd4", "#ffd4b3"][i % 5],
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* Cake layers */}
                <div className="relative">
                    <div
                        className="w-56 h-12 rounded-t-2xl flex items-center justify-center text-lg font-bold"
                        style={{ background: "#ffc0cb", color: "#fff" }}
                    >
                        🍓 Happy Birthday! 🍓
                    </div>
                    <div
                        className="w-64 h-14 mx-auto rounded-b-2xl -mt-1"
                        style={{ background: "#ffadc0", marginLeft: "-0.5rem" }}
                    />
                    <div
                        className="w-72 h-16 mx-auto rounded-b-3xl -mt-1 flex items-center justify-center"
                        style={{ background: "#ff93b0", marginLeft: "-1rem" }}
                    >
                        <span className="text-white text-sm font-medium opacity-80">
                            🌸 🌸 🌸 🌸 🌸
                        </span>
                    </div>
                    {/* Plate */}
                    <div
                        className="w-80 h-4 rounded-full mx-auto mt-1"
                        style={{ background: "#f9d0dc", marginLeft: "-1.5rem" }}
                    />
                </div>
            </motion.div>

            <AnimatePresence mode="wait">
                {!blown ? (
                    <motion.button
                        key="blow"
                        onClick={blow}
                        className="px-8 py-3 rounded-full text-white font-semibold text-lg shadow-lg"
                        style={{ background: "linear-gradient(135deg, #ff85a1, #c985ff)" }}
                        whileHover={{ scale: 1.07 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        🕯️ Blow the candles!
                    </motion.button>
                ) : (
                    <motion.div
                        key="wish"
                        className="text-center px-6 py-5 rounded-2xl"
                        style={{ background: "rgba(255,214,231,0.5)", border: "1.5px solid #ffc0cb" }}
                        initial={{ opacity: 0, scale: 0.7, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ type: "spring", damping: 14 }}
                    >
                        <p className="text-2xl mb-2">🎉 Happy Birthday! 🎉</p>
                        <p className="text-pink-500 text-base leading-relaxed whitespace-pre-line">
                            {CONFIG.wishMessage}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

// ---- Gift Box ----
function GiftBox({ gift, index }) {
    const [open, setOpen] = useState(false);

    return (
        <motion.div
            className="relative cursor-pointer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            onClick={() => setOpen(!open)}
        >
            <AnimatePresence mode="wait">
                {!open ? (
                    <motion.div
                        key="closed"
                        className="w-40 h-44 rounded-2xl flex flex-col items-center justify-end pb-4 shadow-lg select-none"
                        style={{ background: gift.color, border: "2px solid rgba(255,255,255,0.6)" }}
                        whileHover={{ scale: 1.05, rotate: [-1, 1, -1, 0] }}
                        transition={{ rotate: { duration: 0.3 } }}
                        exit={{ scale: 0.5, opacity: 0 }}
                    >
                        {/* Lid */}
                        <div
                            className="absolute top-0 left-0 right-0 h-12 rounded-t-2xl flex items-center justify-center"
                            style={{ background: "rgba(255,255,255,0.35)" }}
                        >
                            <div className="w-8 h-full border-x-2 border-white/60 absolute" />
                        </div>
                        {/* Ribbon bow */}
                        <div className="absolute top-3 text-2xl">🎀</div>
                        <span className="text-4xl">{gift.emoji}</span>
                        <span className="text-xs text-pink-600/70 mt-1 font-medium">Tap to open!</span>
                    </motion.div>
                ) : (
                    <motion.div
                        key="open"
                        className="w-40 min-h-44 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 shadow-lg text-center"
                        style={{ background: gift.color, border: "2px solid rgba(255,255,255,0.6)" }}
                        initial={{ scale: 0.5, rotateY: 90 }}
                        animate={{ scale: 1, rotateY: 0 }}
                        transition={{ type: "spring", damping: 12 }}
                    >
                        <span className="text-3xl">{gift.emoji}</span>
                        <p className="font-bold text-pink-600 text-sm">{gift.title}</p>
                        <p className="text-pink-500 text-xs leading-relaxed">{gift.message}</p>
                        <span className="text-xs text-pink-400 mt-1">Tap to close</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function GiftsSection() {
    return (
        <section className="py-12 flex flex-col items-center gap-8">
            <motion.h2
                className="text-3xl font-bold text-pink-400 text-center"
                style={{ fontFamily: "'Georgia', serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Gifts For You 🎁
            </motion.h2>
            <p className="text-pink-300 text-sm -mt-4">Tap each box to unwrap your surprise!</p>
            <div className="flex flex-wrap gap-6 justify-center">
                {CONFIG.gifts.map((g, i) => (
                    <GiftBox key={i} gift={g} index={i} />
                ))}
            </div>
        </section>
    );
}

// ---- Envelope Component ----
function Envelope({ letter, index }) {
    const [letterOpen, setLetterOpen] = useState(false);

    return (
        <motion.div
            className="flex flex-col items-center gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
        >
            <p className="text-pink-400 text-sm font-medium">Letter {index + 1} 💌</p>

            <motion.div
                className="relative cursor-pointer"
                onClick={() => setLetterOpen(!letterOpen)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
            >
                {/* Envelope body */}
                <div
                    className="w-56 md:w-64 rounded-2xl shadow-xl overflow-hidden"
                    style={{ background: "#fff0f7", border: "2px solid #ffc0cb" }}
                >
                    {/* Envelope flap */}
                    <motion.div
                        className="w-full overflow-hidden"
                        style={{ transformOrigin: "top" }}
                        animate={letterOpen ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                    >
                        <svg viewBox="0 0 256 80" className="w-full">
                            <polygon points="0,0 256,0 128,70" fill="#ffd6e7" />
                            <polygon points="0,0 256,0 128,70" fill="none" stroke="#ffc0cb" strokeWidth="1" />
                        </svg>
                    </motion.div>

                    {/* Letter reveal */}
                    <AnimatePresence>
                        {letterOpen && (
                            <motion.div
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 40, opacity: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="px-5 py-4"
                            >
                                <div
                                    className="text-xs leading-relaxed text-pink-600 whitespace-pre-line"
                                    style={{ fontFamily: "'Georgia', serif", lineHeight: 1.8 }}
                                >
                                    {letter}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Envelope bottom */}
                    {!letterOpen && (
                        <div className="px-6 py-5 text-center">
                            <Mail className="mx-auto text-pink-300 mb-2" size={36} />
                            <p className="text-pink-400 text-sm">Tap to open 💕</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {letterOpen && (
                <motion.button
                    className="text-pink-300 text-xs underline"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setLetterOpen(false)}
                >
                    Seal the letter again
                </motion.button>
            )}
        </motion.div>
    );
}

// ---- Photo Strip + Letters ----
function PhotoAndLetter() {
    const [letterOpen, setLetterOpen] = useState(false);

    return (
        <section className="py-12 px-4 flex flex-col items-center gap-8">
            <motion.h2
                className="text-3xl font-bold text-pink-400 text-center"
                style={{ fontFamily: "'Georgia', serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                Our Moments 📸
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-8 items-center justify-center w-full max-w-3xl">
                {/* Polaroid strip */}
                <motion.div
                    className="flex flex-col gap-4 items-center"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div
                        className="p-3 pb-1 rounded-xl shadow-xl flex flex-col gap-3"
                        style={{ background: "#fff5f8", border: "2px solid #ffd6e7" }}
                    >
                        {CONFIG.photos.map((src, i) => (
                            <motion.div
                                key={i}
                                className="polaroid"
                                style={{
                                    background: "white",
                                    padding: "6px 6px 22px 6px",
                                    boxShadow: "0 2px 8px rgba(255,133,161,0.2)",
                                    transform: `rotate(${(i % 2 === 0 ? 1 : -1) * (i * 0.7 + 0.5)}deg)`,
                                }}
                                whileHover={{ scale: 1.06, rotate: 0, zIndex: 10 }}
                            >
                                <img
                                    src={src}
                                    alt={`Memory ${i + 1}`}
                                    style={{ width: 160, height: 120, objectFit: "cover", display: "block" }}
                                />
                            </motion.div>
                        ))}
                    </div>
                    <p className="text-pink-300 text-xs italic">Our little story ✨</p>
                </motion.div>

                {/* Envelope */}
                <motion.div
                    className="flex flex-col items-center gap-4"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <p className="text-pink-400 text-sm font-medium">A letter, just for you 💌</p>

                    <motion.div
                        className="relative cursor-pointer"
                        onClick={() => setLetterOpen(!letterOpen)}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.97 }}
                    >
                        {/* Envelope body */}
                        <div
                            className="w-64 rounded-2xl shadow-xl overflow-hidden"
                            style={{ background: "#fff0f7", border: "2px solid #ffc0cb" }}
                        >
                            {/* Envelope flap */}
                            <motion.div
                                className="w-full overflow-hidden"
                                style={{ transformOrigin: "top" }}
                                animate={letterOpen ? { scaleY: 0, opacity: 0 } : { scaleY: 1, opacity: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <svg viewBox="0 0 256 80" className="w-full">
                                    <polygon points="0,0 256,0 128,70" fill="#ffd6e7" />
                                    <polygon points="0,0 256,0 128,70" fill="none" stroke="#ffc0cb" strokeWidth="1" />
                                </svg>
                            </motion.div>

                            {/* Letter reveal */}
                            <AnimatePresence>
                                {letterOpen && (
                                    <motion.div
                                        initial={{ y: 40, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: 40, opacity: 0 }}
                                        transition={{ duration: 0.5, delay: 0.2 }}
                                        className="px-5 py-4"
                                    >
                                        <div
                                            className="text-xs leading-relaxed text-pink-600 whitespace-pre-line"
                                            style={{ fontFamily: "'Georgia', serif", lineHeight: 1.8 }}
                                        >
                                            {CONFIG.letters[0]}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Envelope bottom */}
                            {!letterOpen && (
                                <div className="px-6 py-5 text-center">
                                    <Mail className="mx-auto text-pink-300 mb-2" size={36} />
                                    <p className="text-pink-400 text-sm">Tap to open 💕</p>
                                </div>
                            )}
                        </div>
                    </motion.div>

                    {letterOpen && (
                        <motion.button
                            className="text-pink-300 text-xs underline"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            onClick={() => setLetterOpen(false)}
                        >
                            Seal the letter again
                        </motion.button>
                    )}
                </motion.div>
            </div>
        </section>
    );
}

// ---- From Your Son Section ----
function FromYourSonSection() {
    return (
        <section className="py-12 px-4 flex flex-col items-center gap-8">
            <motion.h2
                className="text-3xl font-bold text-pink-400 text-center"
                style={{ fontFamily: "'Georgia', serif" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                From Your Son ❤️
            </motion.h2>

            <div className="flex flex-col md:flex-row gap-10 items-center justify-center w-full max-w-4xl">
                {/* Photo */}
                <motion.div
                    className="p-3 pb-8 rounded-xl shadow-xl bg-white"
                    style={{ border: "1px solid #ffd6e7", transform: "rotate(-2deg)" }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, rotate: 0 }}
                >
                    <img
                        src={`/${CONFIG.sonSection.photo}`}
                        alt="From your son"
                        style={{ width: 220, height: 280, objectFit: "cover", display: "block", borderRadius: "8px" }}
                    />
                </motion.div>

                {/* Letter */}
                <motion.div
                    className="w-full md:w-1/2 p-6 md:p-8 rounded-2xl shadow-lg relative"
                    style={{ background: "#fff5f8", border: "2px dashed #ffc0cb" }}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="absolute -top-5 -left-5 text-4xl">💭</div>
                    <div
                        className="text-sm md:text-base leading-relaxed text-pink-600 whitespace-pre-line"
                        style={{ fontFamily: "'Georgia', serif", lineHeight: 1.8 }}
                    >
                        {CONFIG.sonSection.letter}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

// ---- Audio Player ----
function AudioPlayer() {
    const [muted, setMuted] = useState(true);
    const audioRef = useRef(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = 0.3;
            audioRef.current.muted = muted;
        }
    }, [muted]);

    return (
        <motion.div
            className="fixed bottom-5 right-5 z-50"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
        >
            {/* Replace the src below with your own audio URL */}
            <audio ref={audioRef} loop autoPlay src="love.mp3" />
            <button
                onClick={() => setMuted(!muted)}
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #ff85a1, #c985ff)" }}
                title={muted ? "Unmute music" : "Mute music"}
            >
                {muted ? (
                    <VolumeX size={20} color="white" />
                ) : (
                    <Volume2 size={20} color="white" />
                )}
            </button>
            <p className="text-center text-pink-300 text-xs mt-1">
                {muted ? "🔇" : "🎵"}
            </p>
        </motion.div>
    );
}

// ---- Footer ----
function Footer() {
    return (
        <motion.footer
            className="py-10 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <motion.div
                className="flex justify-center gap-2 text-pink-300 mb-3"
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
            >
                <Heart size={20} fill="#ffc0cb" />
                <Heart size={20} fill="#ffc0cb" />
                <Heart size={20} fill="#ffc0cb" />
            </motion.div>
            <p className="text-pink-400 font-medium" style={{ fontFamily: "'Georgia', serif" }}>
                Made with love, just for you 🌸
            </p>
            <p className="text-pink-200 text-xs mt-1">Happy Birthday, {CONFIG.birthdayName} 💕</p>
        </motion.footer>
    );
}

// ---- Divider ----
function Divider() {
    return (
        <div className="flex items-center gap-3 px-8 my-2">
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to right, transparent, #ffc0cb)" }} />
            <span className="text-pink-300 text-lg">🌸</span>
            <div className="flex-1 h-px" style={{ background: "linear-gradient(to left, transparent, #ffc0cb)" }} />
        </div>
    );
}

// ---- Main App ----
export default function BirthdayTribute() {
    const [unlocked, setUnlocked] = useState(false);

    return (
        <div style={{ fontFamily: "'Georgia', serif" }}>
            <AnimatePresence mode="wait">
                {!unlocked ? (
                    <motion.div key="gate" exit={{ opacity: 0, scale: 0.95 }}>
                        <PinGate onUnlock={() => setUnlocked(true)} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="min-h-screen relative"
                        style={{ background: "linear-gradient(160deg, #fff5f9 0%, #fce8f4 40%, #f0e8ff 100%)" }}
                    >
                        <FloatingHearts />

                        {/* Header */}
                        <motion.header
                            className="relative z-10 text-center pt-16 pb-6 px-4"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="flex justify-center gap-2 mb-4">
                                {[Star, Sparkles, Heart, Sparkles, Star].map((Icon, i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ y: [0, -6, 0] }}
                                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
                                    >
                                        <Icon size={16} className="text-pink-300" fill="#ffd6e7" />
                                    </motion.div>
                                ))}
                            </div>
                            <h1
                                className="text-5xl md:text-6xl font-bold text-pink-400 leading-tight"
                                style={{ textShadow: "0 2px 20px rgba(255,133,161,0.3)" }}
                            >
                                Happy Birthday Amma
                            </h1>
                            <h2 className="text-3xl md:text-4xl text-pink-300 mt-1">{CONFIG.birthdayName} 🎂</h2>
                            <p className="text-pink-300 mt-3 text-sm italic">
                                A little something made with all my heart ✨
                            </p>
                        </motion.header>

                        {/* Sections */}
                        <div className="relative z-10 max-w-2xl mx-auto px-4">
                            <Divider />
                            <WishSection />
                            <Divider />
                            <GiftsSection />
                            <Divider />
                            <PhotoAndLetter />
                            <Divider />
                            <FromYourSonSection />
                            <Divider />
                            <Footer />
                        </div>

                        {/* Audio toggle */}
                        <AudioPlayer />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
