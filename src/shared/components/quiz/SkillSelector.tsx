import React, { useEffect, useState } from 'react';
import { AppConfig } from '../../types';
import { useFSRS } from '../../hooks/useFSRS';

interface SkillSelectorProps {
  config: AppConfig;
  onSelect: (skillId: string | number) => void;
}

export const SkillSelector: React.FC<SkillSelectorProps> = ({ config, onSelect }) => {
  const { getGroupStabilities } = useFSRS();
  const [skillStabilities, setSkillStabilities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (getGroupStabilities) {
      const loadStabilities = async () => {
        const filters: Record<string, (factId: string) => boolean> = {};
        for (const skill of config.skills) {
          if (config.appId === 'multiplication') {
            filters[skill.id] = id => id.endsWith('x' + skill.id) || id.startsWith(skill.id + 'x');
          } else if (config.appId === 'division') {
            filters[skill.id] = id => id.endsWith('÷' + skill.id);
          } else {
            // fractions
            filters[skill.id] = id => id.includes(skill.id.toString());
          }
        }
        const newStabilities = await getGroupStabilities(filters);
        setSkillStabilities(newStabilities);
      };
      loadStabilities();
    }
  }, [config.skills, config.appId, getGroupStabilities]);

  return (
    <div className={`flex flex-col min-h-screen p-6 md:p-12 items-center justify-center ${config.theme.primaryBg}`}>
      <div className="w-full max-w-4xl flex flex-col items-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase mb-8 md:mb-12 transform -rotate-2 text-white drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] text-center">
          Select a Skill
        </h2>
        
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4 md:gap-6 w-full max-w-2xl">
          {config.skills.map((skill) => {
            const mastery = skillStabilities[skill.id] || 0;
            const hue = Math.floor(mastery * 120); // 0 (red) to 120 (green)
            const bgColor = mastery > 0 ? `hsl(${hue}, 100%, 60%)` : 'white';

            return (
              <button
                key={skill.id}
                onClick={() => onSelect(skill.id)}
                style={{ backgroundColor: bgColor }}
                className={`border-4 border-black py-4 md:py-6 text-xl md:text-3xl font-black text-black hover:-translate-y-2 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] doodle-button uppercase`}
              >
                {skill.id}
              </button>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 w-full max-w-xl bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transform rotate-1">
          <h3 className="font-black uppercase text-center mb-2">Mastery Index</h3>
          <div className="h-6 w-full border-2 border-black shadow-inner relative overflow-hidden" style={{ background: 'linear-gradient(to right, hsl(0, 100%, 60%), hsl(60, 100%, 60%), hsl(120, 100%, 60%))' }}>
            <div className="absolute inset-0 bg-white/20 pointer-events-none"></div>
          </div>
          <div className="flex justify-between mt-2 font-bold uppercase text-sm">
            <span>NOOB</span>
            <span>MASTER</span>
          </div>
        </div>
      </div>
    </div>
  );
};
