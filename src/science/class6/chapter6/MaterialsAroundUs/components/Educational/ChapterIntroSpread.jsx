import React, { useEffect, useRef, useState } from 'react';
import { BookOpen, ArrowRight, Link2, Info, ArrowLeft, Lock, Unlock } from 'lucide-react';
import {
  EduBookSpread,
  EduChapterVisual,
  EduQuoteCard,
  EduHeroCard,
  EduFactCell,
  EduCalloutBox,
  EduFactCard
} from '../../../../../../components/edu';

export default function ChapterIntroSpread({ onContinue, onBack }) {
  const rightPageRef = useRef(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  useEffect(() => {
    if (rightPageRef.current) {
      rightPageRef.current.scrollTop = 0;
      const { scrollHeight, clientHeight } = rightPageRef.current;
      if (scrollHeight <= clientHeight + 10) {
        setIsUnlocked(true);
      }
    }
  }, []);

  const handleScroll = (e) => {
    if (isUnlocked) return;
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      setIsUnlocked(true);
    }
  };

  return (
    <EduBookSpread
      rightPageRef={rightPageRef}
      onRightScroll={handleScroll}
      backButton={(
        <button type="button" className="edu-spread-back-btn spread-back-btn" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" />
          Back
        </button>
      )}
      nextButton={(
        <button
          type="button"
          className="edu-spread-next-btn spread-next-btn"
          onClick={onContinue}
          disabled={!isUnlocked}
          title={!isUnlocked ? 'Scroll down to read all content first' : ''}
        >
          {isUnlocked ? <Unlock size={16} aria-hidden="true" /> : <Lock size={16} aria-hidden="true" />}
          Begin Investigation
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      )}
      leftPage={(
        <>
          <div className="edu-page-eyebrow eyebrow">CHAPTER 6 &nbsp;•&nbsp; CLASS 8 SCIENCE</div>
          <h1 className="edu-page-title title">Materials Around Us</h1>

          <EduChapterVisual
            src="/blueprint_glassware.png"
            alt="Laboratory glassware and chemical structures blueprint"
            badge="Ancient Indian Materials Science"
            caption="Blueprint sketch - laboratory glassware & simple chemical structures"
            fallbackSrc="https://via.placeholder.com/800x400/1b2a4a/ffffff?text=Science+Blueprint"
          />

          <EduQuoteCard
            primaryText="उपादानं भवेत्तस्य (मूषायाः) मृत्तिका लोहमेव च।"
            citationSecondary="(रसरत्नसमुच्चय—१०.३)"
            translation="The materials used to make the crucible (a vessel used to melt substances) are clay and iron."
            citation="(Rasaratnasamuchchaya - 10.3)"
          />
        </>
      )}
      rightPage={(
        <>
          <div className="edu-r-heading r-heading">
            <BookOpen size={24} color="#1b2a4a" aria-hidden="true" />
            Historical Facts — Ancient Indian Science
          </div>

          <EduHeroCard title="Ancient Indian Science — Early Materials Engineering">
            Ancient Indian scholars carefully selected materials based on their properties. Long before modern laboratories, they understood that different materials were suitable for different purposes.
          </EduHeroCard>

          <div className="edu-fact-grid--spread grid-container">
            <EduFactCell
              label="Ancient Source"
              title="📜 Rasaratnasamuchchaya"
              description="An important Sanskrit text on metallurgy, minerals, and traditional chemical practices."
            />
            <EduFactCell
              label="Scientific Connection"
              title="🔬 Properties Matter"
              description="Ancient Indians selected clay because it is heat resistant, and iron because it is strong — an early understanding of material properties."
            />
            <EduFactCell
              label="Used For"
              title="🔥 Crucible (Melting Vessel)"
              description="A crucible is a special container used to heat or melt substances at very high temperatures."
            />
            <EduFactCell
              label="Material Choice 1"
              title="🟤 Clay"
              description="Clay can withstand high temperatures without melting easily, making it suitable for the outer body of a crucible."
            />
            <EduFactCell
              label="Material Choice 2"
              title="⚙️ Iron"
              description="Iron provides strength and durability, helping the crucible remain stable during heating."
              wide
            />
          </div>

          <EduCalloutBox variant="orange" title={<><Info size={18} aria-hidden="true" /> Why this matters for our chapter</>}>
            <ul>
              <li>Different materials have different properties.</li>
              <li>We choose materials based on their use, not just their appearance.</li>
              <li>This is exactly why we classify materials in this chapter.</li>
            </ul>
          </EduCalloutBox>

          <EduCalloutBox variant="green" title={<><Link2 size={18} aria-hidden="true" /> Real-Life Example</>}>
            <p>Just like ancient scientists used clay for crucibles, today we use clay to make bricks for houses because it is strong and resists heat. We use iron for cooking pans because it conducts heat well!</p>
          </EduCalloutBox>

          <div className="edu-timeline-heading timeline-heading">Timeline of Indian Materials Science</div>
          <div className="edu-timeline timeline">
            <div className="line" aria-hidden="true" />
            <div className="events">
              <div className="event">
                <div className="dot" aria-hidden="true" />
                <div className="date">3000 BCE</div>
                <div className="desc">Indus Valley baked clay bricks</div>
              </div>
              <div className="event">
                <div className="dot" aria-hidden="true" />
                <div className="date">400 CE</div>
                <div className="desc">Iron Pillar of Delhi built (Rust-resistant iron)</div>
              </div>
              <div className="event">
                <div className="dot" aria-hidden="true" />
                <div className="date">13th Century</div>
                <div className="desc">Rasaratnasamuchchaya written</div>
              </div>
            </div>
          </div>

          <EduFactCard>
            The famous <strong>Iron Pillar of Delhi</strong> was built over 1,600 years ago and has barely rusted! This shows that ancient Indian metallurgists had a highly advanced understanding of materials and how to prevent corrosion.
          </EduFactCard>
        </>
      )}
    />
  );
}
