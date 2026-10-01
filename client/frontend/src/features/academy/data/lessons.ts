export interface LessonPoint {
  label: string;
  text: string;
}

export interface SubTopic {
  title: string;
  points: LessonPoint[];
}

export interface Lesson {
  id: number;
  topicNumber: string;
  title: string;
  image: string;
  subTopics: SubTopic[];
}

// We will append to this array 2 topics at a time!
export const onboardingLessons: Lesson[] = [];

onboardingLessons.push(
  {
    id: 1,
    topicNumber: "Topic 1",
    title: "Floor Presentation & Survival Gear",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "🥾 1. The Protection Footwear",
        points: [
          {
            label: "The Rule",
            text: "You must wear hard safety boots at all times.",
          },
          {
            label: "The Ground Reason",
            text: "Pushing a stack of heavy metal trolleys means your feet are constantly inches away from heavy, moving steel frames and unpredictable castor wheels. Running shoes or casual sneakers will offer zero protection if a 12-stack slips backward onto your foot.",
          },
        ],
      },
      {
        title: "外套 2. Corporate Attire & Identification",
        points: [
          {
            label: "The Working Coats (Idansane)",
            text: "You must wear your designated United Trolley Services working coat (idansane).",
          },
          {
            label: "The Branded Reflector Vest",
            text: "Your high-visibility reflector vest featuring the official United Trolley Services branding must be worn over your coat at all times. Malls are high-traffic zones; you need to be highly visible to reversing cars in the parkings and shoppers in the corridors.",
          },
          {
            label: "Zero External Branding",
            text: "You are strictly banned from wearing unknown, casual, or cool graphic T-shirts under or over your uniform. If you aren't wearing official UTS attire, mall security can remove you from the floor instantly for looking unverified.",
          },
        ],
      },
      {
        title: "🧵 3. The Porter's Life-Line Tools",
        points: [
          {
            label: "The 10m Control Rope",
            text: "You must carry a 10-meter anchor rope on you at the start of every shift. This isn't optional—it is your steering brake. You use it to loop and secure the front trolleys when pulling heavy lines up or down the parking garage ramps.",
          },
          {
            label: "The Floor Cellphone",
            text: "You must keep a working mobile phone in your pocket. It is strictly used for two emergency floor actions: 1. Calling for immediate floor backup if a bay gets completely overwhelmed during a rush. 2. Reporting equipment damage or operational hazards directly to the site supervisor.",
          },
        ],
      },
    ],
  },
  {
    id: 2,
    topicNumber: "Topic 2",
    title: "Team Tactics & Real-Time Communication",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "📱 1. The Active Floor Lifeline (Smartphone + Data)",
        points: [
          {
            label: "The Rule",
            text: "You must always have a working smartphone with active data and a reliable, reachable phone number throughout your entire shift.",
          },
          {
            label: "The Ground Reason",
            text: "You do not move randomly on your own clock. The floor layout changes in seconds. If a supervisor or a teammate cannot reach you instantly because your phone is dead, off, or out of airtime, you are leaving your team stranded.",
          },
        ],
      },
      {
        title: "💬 2. The WhatsApp Group Broadcast Protocol",
        points: [
          {
            label: "The Rule",
            text: "You must constantly update the official team WhatsApp group or your supervisor with exactly where you are and what you are doing.",
          },
          {
            label: "The Specific Commands",
            text: "You never just walk around silently. You report immediately when: Moving Location: 'Leaving Parking E, heading to Parking B Drop-off now.' | Spotting a Pile: 'Massive pile-up of Clicks trolleys forming at Parking B. Need a hand.' | Calling for Backup: 'Dis-Chem bay has over 50 trolleys spilling out. I need backup instantly.'",
          },
        ],
      },
      {
        title: "⚠️ 3. See Something, Say Something",
        points: [
          {
            label: "The Rule",
            text: "If you see any operational hazard, store boundary conflict, or damaged equipment, you must speak up immediately. Communication is your shield.",
          },
          {
            label: "The Ground Reason",
            text: "If you notice a broken castor wheel or a dangerous stack blocking a fire exit and you say nothing, the next porter could get hurt, or United Trolley Services could get slapped with a massive mall fine. You talk to protect your teammates and your job.",
          },
        ],
      },
    ],
  },
);

onboardingLessons.push(
  {
    id: 3,
    topicNumber: "Topic 3",
    title: "Store Relationships & The 'Empty Bay' Panic Protocol",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "🚨 1. The Ultimate Golden Rule: The Bay Must Never Be Empty",
        points: [
          {
            label: "The Rule",
            text: "The physical trolley bay inside or directly outside Clicks, Game, or Dis-Chem must always have stock.",
          },
          {
            label: "The Panic Protocol",
            text: "The exact second you see a store's trolley bay getting down to zero, you instantly activate panic mode: 1. Shout on the WhatsApp Group (e.g., 'Dis-Chem bay empty! Emergency relief needed!'). 2. Sprint to the closest designated parking level for that specific store (e.g., Parking A for Dis-Chem, Parking E/G for Game) to pull an immediate short stack for rapid floor relief.",
          },
          {
            label: "The Ground Reason",
            text: "If a customer walks to the door and can't find a trolley, they walk out. The store loses money, the store manager gets furious, and they will cancel the United Trolley Services contract.",
          },
        ],
      },
      {
        title: "🤝 2. Managing the Store Managers (Speak with Respect)",
        points: [
          {
            label: "The Rule",
            text: "Always speak politely, calmly, and respectfully to the store managers and supervisors.",
          },
          {
            label: "The Ground Reason",
            text: "Most new hires don't realize that store managers hold the ultimate power to end your employment contract on the spot. Even if you are overwhelmed and exhausted, they must see you trying. Show them you care, sympathize with their frustration when the floor is crazy, and assure them you are working as fast as possible to refill the bays. A manager who sees you sweating and trying will help you; a manager who sees you lounging or talking back will fire the company.",
          },
        ],
      },
      {
        title: "🔍 3. The Hidden In-Store Sweeps (Backrooms & Floor Workers)",
        points: [
          {
            label: "The Rule",
            text: "Do not just look out in the parking lots. You must actively enter the stores to hunt for hidden, trapped trolleys.",
          },
          {
            label: "Where to Look",
            text: "The Backroom/Receiving Bay: Store staff often hoard trolleys in the back to move boxes, pack stock, or discard rubbish. | The Aisles: Staff leave them deep in the corridors after merchandising.",
          },
          {
            label: "The Ground Reason",
            text: "Customers get mad when they see workers using up all the active trolleys inside while the main front entrance is completely empty. Go inside, politely ask the staff if they are done with the trolley, and return it to the front bay.",
          },
        ],
      },
    ],
  },
  {
    id: 4,
    topicNumber: "Topic 4",
    title: "Trolley Physics, Stacking, & The Rope Lifeline",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "❌ 1. The Trap of the Factory Clamps",
        points: [
          {
            label: "The Rule",
            text: "Never rely on the built-in metal clamps to hold a large stack of trolleys when moving fast.",
          },
          {
            label: "The Ground Reason",
            text: "While trolleys are designed to stack into each other, those factory clamps are not meant for high-speed corridor turns. If you clamp 15 to 20 trolleys and speed through the mall, the tension will cause the clamps to snap or warp out of place. The stack will instantly break loose, slamming into shoppers or scratching expensive customer cars in the parking lot, which will get you fired immediately.",
          },
        ],
      },
      {
        title: "🧵 2. The 5-Trolley Rope Rule",
        points: [
          {
            label: "The Rule",
            text: "If you are pushing more than 5 trolleys, you must use your 10-meter anchor rope. No exceptions.",
          },
          {
            label: "The Technique",
            text: "Loop the rope securely through the front trolley's frame and pull it tight back to the rear. The rope absorbs the shifting pressure of the metal line, acts as a master handbrake, and gives you total steering control around tight tile corners.",
          },
        ],
      },
      {
        title: "👥 3. The 30-Trolley Protocol: Double-Up or Split",
        points: [
          {
            label: "The Rule",
            text: "When a parking bay is completely overflowing and you find yourself facing 30 or more trolleys, you have exactly two safe choices: Option A (Call for Floor Backup): Post on the WhatsApp group for a teammate. One porter stands at the back to push the weight, while the other porter stands at the front holding the rope to steer and navigate safely through the crowds. | Option B (The 15/15 Split): If no backup is available, break the stack down into two separate lines of 15 and 15. Move the first 15 to a safe midway staging point, then go back for the second half.",
          },
          {
            label: "The Ground Reason",
            text: "Trying to push 30 trolleys by yourself is pure suicide. The weight will cause the line to buckle out of control, destroying your back and risking a massive crash.",
          },
        ],
      },
    ],
  },
);

onboardingLessons.push(
  {
    id: 5,
    topicNumber: "Topic 5",
    title: "Customer Readiness & The Quality Filter Protocol",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "🧹 1. The Storefront Readiness Rule (Zero Trash)",
        points: [
          {
            label: "The Rule",
            text: "Before you push any stack of trolleys into the customer bay at Clicks, Game, or Dis-Chem, you must manually inspect and clear every single trolley frame.",
          },
          {
            label: "The Check",
            text: "Remove previous till slips, leftover shopping bags, discarded plastic, or any old customer items. The next shopper must find the trolley completely blank, empty, and ready for use.",
          },
        ],
      },
      {
        title: "⚙️ 2. The Quality Filter: Red-Tagging the Bad Units",
        points: [
          {
            label: "The Rule",
            text: "If a trolley is heavily stained, smells bad, has sticky spills, or has a broken/locked castor wheel, it is legally banned from entering the customer bay.",
          },
          {
            label: "The Action",
            text: "Filter it out of the active line immediately. Take it away from the customer entrances and store it safely in the UTS Maintenance Bay (The Broken Compound) behind the mall service corridors.",
          },
          {
            label: "The Ground Reason",
            text: "Shoving a dirty or broken trolley into the front line means a customer will pull it out, get frustrated, blame the store, and ruin the UTS relationship.",
          },
        ],
      },
      {
        title: "📸 3. The Evidence Broadcast (CYA: Cover Your Actions)",
        points: [
          {
            label: "The Rule",
            text: "The exact second you drop a dirty or broken trolley in the Maintenance Bay, you must pull out your floor cellphone, take a clear picture of the damage, and post it to the team WhatsApp group.",
          },
          {
            label: "The Ground Reason",
            text: "If the store manager notices that their total trolley count is dropping, they will accuse your team of losing equipment. Your WhatsApp picture is your digital proof. It tells the supervisor and the store exactly which trolley numbers are out of order and why they aren't on the floor, protecting you and your team from blame.",
          },
        ],
      },
    ],
  },
  {
    id: 6,
    topicNumber: "Topic 6",
    title: "The Battlefield Schedule: Shift Rotations & Attendance Discipline",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "⏰ 1. The 3-Wave Shift Rotation",
        points: [
          {
            label: "The Morning Openers (06:00)",
            text: "Arrive before mall doors open to clear overnight parking stray units and guarantee full store bays at opening.",
          },
          {
            label: "The Reinforcements (11:00)",
            text: "Inject fresh energy onto the floor right as the daytime mid-day traffic begins to spike.",
          },
          {
            label: "The Night Sweepers (21:00)",
            text: "Complete a full sweep of Parkings A, B, E, and G to secure all remaining trolleys inside the main bays overnight.",
          },
        ],
      },
      {
        title: "🚨 2. The Early-Alert Rule (Standby Protocol)",
        points: [
          {
            label: "The Rule",
            text: "If you are sick, injured, or have an absolute emergency and cannot make your shift, you must report it early on the group chat.",
          },
          {
            label: "The Ground Reason",
            text: "Reporting your absence early gives the supervisor enough time to call in a standby porter to cover your post. If you call in late or don't show up, you leave your teammates stranded on the floor to do double the work.",
          },
        ],
      },
      {
        title: "🗓️ 3. The Weekend Blackout Rule (Fri, Sat, Sun)",
        points: [
          {
            label: "The Rule",
            text: "Taking elective days off on Fridays, Saturdays, or Sundays is strictly banned.",
          },
          {
            label: "The Ground Reason",
            text: "These three days are when Gateway Mall is at its absolute busiest. Furthermore, Sunday morning is your mandatory Great Wash Day. The company requires maximum manpower on the floor during these windows—everyone must be present.",
          },
        ],
      },
      {
        title: "🔒 4. The 17:00 – 20:00 'Lock-In' Phase",
        points: [
          {
            label: "The Rule",
            text: "This is the absolute heaviest peak hour of the entire day.",
          },
          {
            label: "The Tactic",
            text: "When the clock hits 17:00, everyone must lock in. This is not the time to take loose breaks, sit in the corridors, or check your personal phone. Keep your eyes glued to the bays, step up communication on the group chat, and move with maximum speed until the rush subsides at 20:00.",
          },
        ],
      },
      {
        title: "🍱 5. Staggered Breaks & Earned Leave",
        points: [
          {
            label: "The Lunch Rule",
            text: "Porters must stagger breaks. Never walk off to the canteen at the same time. Always broadcast who is covering your zone on WhatsApp before leaving.",
          },
          {
            label: "The Rest Cycle",
            text: "After putting in consistent, hard floor time across the busy seasons, porters earn a 15-day cycle of paid leave to fully rest, recover, and visit family before returning to the rotation.",
          },
        ],
      },
    ],
  },
);

onboardingLessons.push(
  {
    id: 7,
    topicNumber: "Topic 7",
    title: "The Sunday Wash Protocol & Weather Check",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "☀️ 1. Sunday Strategy & The Weather Check First",
        points: [
          {
            label: "The Timing",
            text: "Washing is strictly done on Sundays during the quiet morning hours when most people are at church and floor traffic is at its absolute lowest. You round up dirty units to the UTS Maintenance Bay yard.",
          },
          {
            label: "The Golden Rule",
            text: "Never start washing unless it is completely sunny outside.",
          },
          {
            label: "The Ground Reason",
            text: "If you wash on a cold, overcast, or damp day, the trolleys will stay wet for hours. They will rust, smell damp, and you won't be able to return them to the floor in time. A hot sun dries the metal and plastic frames naturally in minutes.",
          },
        ],
      },
      {
        title: "🚀 2. The Wash Yard Arsenal & Speed Tactics",
        points: [
          {
            label: "The Pressure Pumper",
            text: "Hook up the high-pressure water pumper to blast off caked-on floor mud and wheel grease instantly.",
          },
          {
            label: "The Chemical Soap & Sacks",
            text: "Apply the heavy-duty chemical soap using rough sacks and sponges to aggressively scrub down the handles and wire cages.",
          },
          {
            label: "The Speed Rule",
            text: "Do a quick manual wipe-down with drying cloths before lining them up under the open sun for rapid baking. Wash in rapid batches so equipment isn't sitting trapped when afternoon shoppers arrive.",
          },
        ],
      },
      {
        title: "🏰 3. Guarding the Kingdom (Never Leave the Bays Empty)",
        points: [
          {
            label: "The Iron-Clad Rule",
            text: "Even during a mass wash day, the front trolley bays must never be abandoned.",
          },
          {
            label: "The Tactic",
            text: "The team must split. While the main group is in the wash yard pumping water and scrubbing frames, at least one porter must remain on the floor to guard the store bays. They must keep a small stash of clean, dry trolleys ready for the Sunday lunch shoppers. The bay is your ultimate kingdom—it cannot be left defenseless.",
          },
        ],
      },
    ],
  },
  {
    id: 8,
    topicNumber: "Topic 8",
    title: "The Fleet Audit & Daily Stock-Take",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "📊 1. The Twin Count Protocol (Morning vs. Afternoon)",
        points: [
          {
            label: "The Morning Audit (06:30)",
            text: "Right after the morning openers clear the strays from the parking lots. This gives you your baseline starting number for the day.",
          },
          {
            label: "The Afternoon Audit (16:30)",
            text: "Right before the massive 17:00 – 20:00 peak lock-in rush hits. This tells you exactly how much active equipment you have available to fight the evening rush.",
          },
        ],
      },
      {
        title: "📐 2. The Verification Mathematics (Tracking the Delta)",
        points: [
          {
            label: "The Evaluation",
            text: "When you submit the numbers, you don't just write a random figure. You track whether the fleet is dropping or increasing, and you must state the exact reason why.",
          },
          {
            label: "If the number drops",
            text: "You must account for the missing units instantly. (e.g., 'Morning count: 120. Afternoon count: 115. Note: 5 units removed from the floor to the Maintenance Bay due to locked wheels.')",
          },
          {
            label: "If the number increases",
            text: "You must verify if a different shift successfully recovered units that were trapped deep inside store receiving bays or remote parking levels.",
          },
        ],
      },
      {
        title: "🛡️ 3. The Shield Against Store Accusations",
        points: [
          {
            label: "The Rule",
            text: "Keep these numbers recorded cleanly on the team group chat every single day.",
          },
          {
            label: "The Ground Reason",
            text: "This data is your ultimate legal shield. When the store manager claims, 'Your team is losing my store equipment,' the supervisor can pull up the daily logs and say, 'Sir, our audits show we started the week with 150 trolleys, and we still have exactly 150 trolleys on site today. None are lost; 10 are just currently undergoing wheel maintenance in our yard.'",
          },
        ],
      },
    ],
  },
);

onboardingLessons.push(
  {
    id: 9,
    topicNumber: "Topic 9",
    title: "Trolley Anatomy & On-Site Maintenance Hacks",
    image: "https://picsum.photos",
    subTopics: [
      {
        title: "⚙️ 1. The 4 Core Parts of Trolley Anatomy",
        points: [
          {
            label: "The Chassis",
            text: "The heavy steel bottom frame that holds the entire structure together and connects to the wheels. (Check for cracks or bending here).",
          },
          {
            label: "The Wire Basket/Cage",
            text: "The main compartment where the customers place their items.",
          },
          {
            label: "The Back-Gate",
            text: "The swinging metal or plastic flap at the rear of the basket. This is what allows trolleys to slide into each other when nesting a stack. If it gets bent or knocked off its hinges, the trolley cannot stack anymore.",
          },
          {
            label: "The Castor Wheels",
            text: "The 4 rotating wheels at the bottom. The front two are usually swivel castors for steering, and the rear two are fixed wheels. Look out for flat spots, rust, or tangled hair/plastic wrapping that freezes the bearings.",
          },
        ],
      },
      {
        title: "🛠️ 2. The On-Site Technician Advantage (The 10-Minute Fix)",
        points: [
          {
            label: "The Strategy",
            text: "You don't need an engineering degree to fix basic trolley issues. A designated on-site porter can act as the branch technician using a basic spanner and a lubricant spray (like WD-40 or Q20).",
          },
          {
            label: "Seized Wheels Hack",
            text: "Instead of dumping the trolley, check the castor axle. Cut away trapped plastic floor strings or hair with a pocket knife and blast it with lubricant.",
          },
          {
            label: "Bent Back-Gates Hack",
            text: "If a gate is stuck, unhook it from the top chassis hinges, straighten the wire frame manually or with a small mallet, and snap it back into place so it swings freely again.",
          },
          {
            label: "The Ground Reason",
            text: "This saves the company thousands in external maintenance fees and instantly increases your active fleet count on heavy weekend rushes.",
          },
        ],
      },
    ],
  },
  {
    id: 10,
    topicNumber: "Topic 10",
    title: "Security, Lost Items & Emergency Protocols",
    image: "https://picsum.photos",
    subTopics: [
      {
        title:
          "💎 1. The Lost Property Gold Standard (The Anti-Theft Protocol)",
        points: [
          {
            label: "The Problem",
            text: "Shoppers constantly leave incredibly expensive items inside trolley baskets—handbags, smartphones, car keys, passports, or high-end shopping bags from jewelry or electronics stores.",
          },
          {
            label: "The Iron-Clad Action",
            text: "1. Do not pocket it or hide it: Even if no one is looking, mall cameras are tracking you. 2. Take a Picture Immediately: Post it to the team WhatsApp group ('Found black handbag in Game bay trolley #04'). 3. Hand It Over Live: Walk directly to the closest store manager or the main Gateway Mall Security Desk. Ensure they log it, take the name of the officer, and post confirmation back.",
          },
          {
            label: "The Ground Reason",
            text: "This completely shields you and United Trolley Services from legal liability if a customer claims their cash or phone went missing while inside your team's territory.",
          },
        ],
      },
      {
        title: "🛑 2. Spotting and Handling Trolley Theft",
        points: [
          {
            label: "The Problem",
            text: "Casual thieves or external informal collectors constantly try to wheel expensive store trolleys out of the mall boundaries onto the public streets or nearby taxi ranks.",
          },
          {
            label: "The Safety Rule",
            text: "Never engage in physical violence or dangerous confrontations.",
          },
          {
            label: "The Tactic",
            text: "If you see someone pushing a UTS brand trolley past the legal red line parking boundaries toward the main road: Inform them politely that the trolley is legally banned from leaving the property. If they resist, withdraw immediately. Pull out your phone, record a quick 5-second video or picture, and broadcast it to the group chat so the site supervisor can dispatch main mall security. Your physical safety is worth infinitely more than a piece of metal.",
          },
        ],
      },
      {
        title: "🚑 3. Medical or Floor Emergencies (Crowd Control)",
        points: [
          {
            label: "The Protocol",
            text: "Because you are constantly on the floor, you might be the very first person to witness a customer slip, faint, drop their groceries, or get injured near a parking ramp. 1. Clear your trolley stack out of the way instantly so it does not block the path of paramedics. 2. Use your active smartphone lifeline to pin the location and alert your supervisor to contact Gateway Centre Control. 3. Stand guard to guide shoppers away from the incident zone until official backup arrives.",
          },
        ],
      },
    ],
  },
);
