// "use client";;
// import { cn } from "../lib/utils";
// import React, { useState, createContext, useContext } from "react";
// import { AnimatePresence, motion } from "motion/react";
// import { IconMenu2, IconX } from "@tabler/icons-react";

// const SidebarContext = createContext(undefined);

// export const useSidebar = () => {
//   const context = useContext(SidebarContext);
//   if (!context) {
//     throw new Error("useSidebar must be used within a SidebarProvider");
//   }
//   return context;
// };

// export const SidebarProvider = ({
//   children,
//   open: openProp,
//   setOpen: setOpenProp,
//   animate = true
// }) => {
//   const [openState, setOpenState] = useState(false);

//   const open = openProp !== undefined ? openProp : openState;
//   const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

//   return (
//     <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
//       {children}
//     </SidebarContext.Provider>
//   );
// };

// export const Sidebar = ({
//   children,
//   open,
//   setOpen,
//   animate
// }) => {
//   return (
//     <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
//       {children}
//     </SidebarProvider>
//   );
// };

// export const SidebarBody = (props) => {
//   return (
//     <>
//       <DesktopSidebar {...props} />
//       <MobileSidebar {...(props)} />
//     </>
//   );
// };

// export const DesktopSidebar = ({
//   className,
//   children,
//   ...props
// }) => {
//   const { open, setOpen, animate } = useSidebar();
//   return (
//     <>
//       <motion.div
//         className={cn(
//           "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
//           className
//         )}
//         data-language="true"
//         animate={{
//           width: animate ? (open ? "300px" : "60px") : "300px",
//         }}
//         onMouseEnter={() => setOpen(true)}
//         onMouseLeave={() => setOpen(false)}
//         {...props}>
//         {children}
//       </motion.div>
//     </>
//   );
// };

// export const MobileSidebar = ({
//   className,
//   children,
//   ...props
// }) => {
//   const { open, setOpen } = useSidebar();
//   return (
//     <>
//       <div
//         className={cn(
//           "h-10 px-4 py-4 flex flex-row md:hidden items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full",
//           className // Corrected syntax
//         )}
//         // Moved outside of className
//         {...props}
//       >
//         <div className="flex justify-end z-20 w-full">
//           <IconMenu2
//             className="text-neutral-800 dark:text-neutral-200"
//             onClick={() => setOpen(!open)}
//           />
//         </div>
//         <AnimatePresence>
//           {open && (
//             <motion.div
//               initial={{ x: "-100%", opacity: 0 }}
//               animate={{ x: 0, opacity: 1 }}
//               exit={{ x: "-100%", opacity: 0 }}
//               transition={{
//                 duration: 0.3,
//                 ease: "easeInOut",
//               }}
//               className={cn(
//                 "fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between",
//                 className
//               )}
//             >
//               <div
//                 className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
//                 onClick={() => setOpen(!open)}
//               >
//                 <IconX />
//               </div>
//               {children}
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </>
//   );
// };

// export const SidebarLink = ({
//   link,
//   className,
//   ...props
// }) => {
//   const { open, animate } = useSidebar();
//   return (
//     <a
//       href={link.href}
//       className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)}
//       data-translate="true" // Added this attribute
//       data-original-text={link.label} // Store original text for translation
//       {...props}
//     >
//       {/* Render the icon separately to ensure it is not affected by translation */}
//       <span className="shrink-0">{link.icon}</span>
//       <motion.span
//         animate={{
//           display: animate ? (open ? "inline-block" : "none") : "inline-block",
//           opacity: animate ? (open ? 1 : 0) : 1,
//         }}
//         className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
//       >
//         {link.label}
//       </motion.span>
//     </a>
//   );
// };

// const translatePage = async (newLang) => {
//   if (newLang === language) return;

//   setIsTranslating(true);

//   try {
//     // Translate all translatable elements
//     const translatableElements = document.querySelectorAll('[data-translate]');
//     const translationPromises = [];

//     translatableElements.forEach(el => {
//       const originalText = el.dataset.originalText || el.querySelector('motion.span')?.textContent.trim();
//       if (originalText) {
//         translationPromises.push(
//           translateText(originalText, newLang).then(translatedText => {
//             if (translatedText && translatedText !== originalText) {
//               // Update only the text content inside the <motion.span> element
//               const textSpan = el.querySelector('motion.span');
//               if (textSpan) {
//                 textSpan.textContent = translatedText;
//               }
//               el.dataset.originalText = originalText; // Store original text for future translations
//             }
//           })
//         );
//       }
//     });

//     await Promise.all(translationPromises);

//     setLanguage(newLang);
//     localStorage.setItem('language', newLang); // Persist language in localStorage
//   } catch (error) {
//     console.error('Page translation failed:', error);
//   } finally {
//     setIsTranslating(false);
//   }
// };


// src/ui/sidebar.jsx
"use client";
import { cn } from "../lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion"; // Fixed import
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(true); // Open by default

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...props} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden md:flex md:flex-col bg-gradient-to-b from-blue-600 via-violet-600 to-white w-64 shrink-0",
        className
      )}
      animate={{
        width: animate ? (open ? "16rem" : "5rem") : "16rem",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen } = useSidebar();
  return (
    <div className={cn("md:hidden", className)} {...props}>
      <div className="h-10 px-4 py-4 flex flex-row items-center justify-between w-full">
        <div className="flex justify-end z-20 w-full">
          <IconMenu2
            className="text-neutral-800 dark:text-neutral-200"
            onClick={() => setOpen(!open)}
          />
        </div>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed h-full w-full inset-0 bg-white dark:bg-neutral-900 p-10 z-[100] flex flex-col justify-between"
          >
            <div
              className="absolute right-10 top-10 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(!open)}
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SidebarLink = ({
  link,
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  return (
    <a
      href={link.href}
      className={cn("flex items-center justify-start gap-2 group/sidebar py-2", className)}
      data-translate="true" // Added this attribute
      {...props}
    >
      {link.icon}
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0"
      >
        {link.label}
      </motion.span>
    </a>
  );
};