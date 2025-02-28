import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { ChevronUpIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Disclosure } from '@headlessui/react';

interface RuleSection {
  title: string;
  content: string[];
}

interface RulesProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Rules({ isOpen, onClose }: RulesProps) {
  const [showVariants, setShowVariants] = useState(false);

  const basicRules: RuleSection[] = [
    {
      title: "Setup",
      content: [
        "2-4 players",
        "Standard 52-card deck",
        "Deal 7 cards to each player",
        "Place remaining cards face down as draw pile",
        "Turn top card face up to start discard pile"
      ]
    },
    {
      title: "Gameplay",
      content: [
        "On your turn:",
        "1. Draw one card (from deck or top of discard pile)",
        "2. Make melds or add to existing melds",
        "3. Discard one card face up",
        "Game ends when a player reaches 500 points or deck is depleted twice"
      ]
    },
    {
      title: "Scoring",
      content: [
        "Aces: 15 points",
        "Face cards (K, Q, J): 10 points",
        "Number cards: Face value",
        "Unmelded cards count against your score",
        "First player to go out gets 25 bonus points"
      ]
    },
    {
      title: "Valid Melds",
      content: [
        "Sets: Three or four cards of same rank",
        "Runs: Three or more consecutive cards of same suit",
        "Must have at least 3 cards to form initial meld"
      ]
    }
  ];

  const variantRules: RuleSection[] = [
    {
      title: "Joker Variant",
      content: [
        "Include both jokers in deck",
        "Jokers are wild and worth 25 points",
        "Can only use one joker per meld"
      ]
    },
    {
      title: "Partnership Play",
      content: [
        "Play with 4 players in fixed partnerships",
        "Partners sit across from each other",
        "Combine scores with partner",
        "First partnership to 500 points wins"
      ]
    },
    {
      title: "Buy-In Rules",
      content: [
        "Players can 'buy' the top discard by drawing two cards",
        "Must use bought card in a meld immediately",
        "Limited to one buy per turn"
      ]
    }
  ];

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-3xl rounded-xl bg-white p-6 dark:bg-gray-800">
          <div className="mb-4 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-white">
              Rummy 500 Rules
            </Dialog.Title>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
            <div className="space-y-2">
              {basicRules.map((section) => (
                <Disclosure key={section.title} defaultOpen={true}>
                  {({ open }) => (
                    <div className="rounded-lg bg-white dark:bg-gray-800">
                      <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                        <span>{section.title}</span>
                        <ChevronUpIcon
                          className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
                        />
                      </Disclosure.Button>
                      <Disclosure.Panel className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                        <ul className="list-inside list-disc space-y-1">
                          {section.content.map((rule, index) => (
                            <li key={index}>{rule}</li>
                          ))}
                        </ul>
                      </Disclosure.Panel>
                    </div>
                  )}
                </Disclosure>
              ))}
            </div>

            <div className="pt-4">
              <button
                onClick={() => setShowVariants(!showVariants)}
                className="mb-4 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                {showVariants ? 'Hide Variant Rules' : 'Show Variant Rules'}
              </button>

              {showVariants && (
                <div className="space-y-2">
                  {variantRules.map((section) => (
                    <Disclosure key={section.title}>
                      {({ open }) => (
                        <div className="rounded-lg bg-white dark:bg-gray-800">
                          <Disclosure.Button className="flex w-full justify-between rounded-lg bg-gray-100 px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
                            <span>{section.title}</span>
                            <ChevronUpIcon
                              className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-gray-500`}
                            />
                          </Disclosure.Button>
                          <Disclosure.Panel className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                            <ul className="list-inside list-disc space-y-1">
                              {section.content.map((rule, index) => (
                                <li key={index}>{rule}</li>
                              ))}
                            </ul>
                          </Disclosure.Panel>
                        </div>
                      )}
                    </Disclosure>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}