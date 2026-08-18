export const RACE_PLANS = {
  Nige: 'Take the lead from the gate and hold it wire-to-wire. Spend early stamina to open a gap before the pack settles, then manage pace carefully down the backstretch — a front runner has nowhere to hide if it gets caught, so stamina and positioning skills that protect the lead matter more than raw late-race power.',
  Senkou: 'Sit just off the leaders in second or third, conserving stamina while the front runner burns theirs. Time the move around the final corner: too early and you fade, too late and you run out of track. Positioning skills that secure a clean lane matter as much as speed stats.',
  Sashi: 'Stay mid-pack through the early and middle legs, screened from the wind, then unleash a sustained closing kick in the final third. This style needs a balance of speed and stamina — enough gas left in the tank to out-accelerate the field without draining reserves too early.',
  Oikomi: 'Hang back near the rear of the field and trust a explosive late surge. This is the highest-risk, highest-reward style — it needs excellent stamina management and guts to push through a crowded final stretch, since a late gap that never opens means a wasted race.',
}

export const SKILL_PRIORITIES = {
  Nige: [
    { category: 'Pace-securing skills', rationale: 'Lock in the lead early so it can\'t be contested out of the gate.' },
    { category: 'Straightaway acceleration', rationale: 'Extend the gap on the final stretch when everyone else is closing.' },
    { category: 'Stamina-recovery skills', rationale: 'Offset the cost of leading the whole race unshielded from the wind.' },
    { category: 'Corner stability', rationale: 'Avoid losing position on turns when there\'s no one ahead to draft.' },
  ],
  Senkou: [
    { category: 'Positioning / lane-securing skills', rationale: 'Guarantee a clean path to make the decisive move without getting boxed in.' },
    { category: 'Mid-race acceleration', rationale: 'Close the gap on the leader precisely when the pace slackens.' },
    { category: 'Stamina-conservation skills', rationale: 'Stay efficient while shadowing the pace before committing to the kick.' },
  ],
  Sashi: [
    { category: 'Final-corner acceleration', rationale: 'Convert a mid-pack position into a closing run at exactly the right moment.' },
    { category: 'Stamina-management skills', rationale: 'Balance a long closing kick against a race spent mostly conserving energy.' },
    { category: 'Traffic-navigation skills', rationale: 'Get through a crowded mid-pack cleanly on the way to the front.' },
  ],
  Oikomi: [
    { category: 'Late-race explosive acceleration', rationale: 'This style lives or dies on the size of the final kick.' },
    { category: 'Guts / willpower skills', rationale: 'Push through a packed final stretch when lanes are tightest.' },
    { category: 'Stamina-management skills', rationale: 'Survive sitting at the back long enough for the kick to matter.' },
    { category: 'Recovery skills', rationale: 'Blunt the stamina drain of the longest, latest sprint of any style.' },
  ],
}
