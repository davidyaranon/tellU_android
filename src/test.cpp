#include <iostream>
#include <regex>
#include <string>
#include <map>
#include <vector>

int main() {
    std::string input = R"(AST C210 X-rays and Extreme Ultraviolet Radiation 3 Units [+]Expand course description

AST C225 Thin-Film Science and Technology 3 Units [+]Expand course description

AST C239 Partially Ionized Plasmas 3 Units [+]Expand course description

AST C295R Applied Spectroscopy 3 Units [+]Expand course description

AST 299 Individual Study or Research 1 - 12 Units [+]Expand course description

ARABIC 1A Elementary Arabic 5 Units [+]Expand course description

ARABIC 1B Elementary Arabic 5 Units [+]Expand course description

ARABIC 10 Intensive Elementary Arabic 10 Units [+]Expand course description

ARABIC 11 Arabic for Reading Knowledge 4 Units [+]Expand course description

ARABIC 15 Spoken Arabic 6 Units [+]Expand course description

ARABIC 15B Spoken Arabic 3 Units [+]Expand course description

ARABIC 20A Intermediate Arabic 5 Units [+]Expand course description

ARABIC 20B Intermediate Arabic 5 Units [+]Expand course description

ARABIC 30 Intermediate Arabic 10 Units [+]Expand course description

ARABIC 50 Advanced Arabic 10 Units [+]Expand course description

ARABIC 100A Advanced Arabic 3 Units [+]Expand course description

ARABIC 100B Advanced Arabic 3 Units [+]Expand course description

ARABIC 103 Media Arabic 4 Units [+]Expand course description

ARABIC 104A Modern Arabic Prose 3 Units [+]Expand course description

ARABIC 104B Classical Arabic Prose 3 Units [+]Expand course description

ARABIC 105A Modern Arabic Poetry 3 Units [+]Expand course description

ARABIC 105B Classical Arabic Poetry 3 Units [+]Expand course description

ARABIC 107 Arabic Historical and Geographical Texts 3 Units [+]Expand course description

ARABIC 108 Islamic Religious and Philosophical Texts in Arabic 3 Units [+]Expand course description

ARABIC 111A Survey of Arabic Literature (in Arabic) 3 Units [+]Expand course description

ARABIC 111B Survey of Arabic Literature (in Arabic) 3 Units [+]Expand course description

ARABIC 115A Colloquial Arabic 4 Units [+]Expand course description

ARABIC 115B Colloquial Arabic 4 Units [+]Expand course description

ARABIC H195 Senior Honors 2 - 4 Units [+]Expand course description

ARABIC 198 Directed Group Study for Upper Division Students 1 - 4 Units [+]Expand course description

ARABIC 199 Supervised Independent Study and Research 1 - 4 Units [+]Expand course description

ARABIC 200 Arabic Grammatical Tradition 3 Units [+]Expand course description

ARABIC 202 History of Arabic 3 Units [+]Expand course description

ARABIC 212 Topics in Modern Arabic Literature: Poetry 3 Units [+]Expand course description

ARABIC 220 Seminar in Classical Arabic Literature 3 Units [+]Expand course description

ARABIC 245 Seminar: Modernist Arabic Poetics 3 Units [+]Expand course description

ARABIC 298 Seminar 1 - 4 Units [+]Expand course description

ARCH 11A Introduction to Visual Representation and Drawing 4 Units [+]Expand course description

ARCH 11B Introduction to Design 5 Units [+]Expand course description

ARCH 24 Freshman Seminars 1 Unit [+]Expand course description

ARCH 39A Freshman/Sophomore Seminar 2 - 4 Units [+]Expand course description

ARCH 84 Sophomore Seminar 1 or 2 Units [+]Expand course description

ARCH 98 Special Group Study 1 - 4 Units [+]Expand course description

ARCH 98BC Berkeley Connect 1 Unit [+]Expand course description

ARCH 100A Fundamentals of Architectural Design 6 Units [+]Expand course description

ARCH 100B Fundamentals of Architectural Design 6 Units [+]Expand course description

ARCH 100C Architectural Design III 5 Units [+]Expand course description

ARCH 100D Architectural Design IV 5 Units [+]Expand course description

ARCH 102A Capstone Project Preparation Seminar 3 Units [+]Expand course description

ARCH 102B Architecture Capstone Project 5 Units [+]Expand course description

ARCH 105 Deep Green Design 4 Units [+]Expand course description

ARCH 107 Introduction to the Practice of Architecture 3 Units [+]Expand course description

ARCH 108 Architectural Internship 5 Units [+]Expand course description

ARCH 109 Special Topics in Architectural Design 1 - 4 Units [+]Expand course description

ARCH 110AC The Social and Cultural Processes in Architecture & Urban Design 3 Units [+]Expand course description

ARCH 111 Housing: An International Survey 3 Units [+]Expand course description

ARCH 112 The Social Life of Building 3 Units [+]Expand course description

ARCH 119 Special Topics in the Social and Cultural Basis of Design 1 - 4 Units [+]Expand course description

ARCH 122 Principles of Computer Aided Architectural Design 4 Units [+]Expand course description

ARCH 123 2-D Computer Technology 2 Units [+]Expand course description

ARCH 124A Introduction to Digital Design Methods 2 Units [+]Expand course description

ARCH 124B 3-D Computer Technology 2 Units [+]Expand course description

ARCH 125A Building Information Technology 2 Units [+]Expand course description

ARCH 127 Workshop in Designing Virtual Places 4 Units [+]Expand course description

ARCH 129 Special Topics in Digital Design Theories and Methods 1 - 4 Units [+]Expand course description

ARCH 130 Introduction to Architectural Design Theory and Criticism 4 Units [+]Expand course description

ARCH 133 Architectures of Globalization: Contested Spaces of Global Culture 3 Units [+]Expand course description

ARCH 136 The Literature of Space 3 Units [+]Expand course description

ARCH 139 Special Topics in Architectural Design Theory and Criticism 1 - 4 Units [+]Expand course description

ARCH 140 Energy and Environment 4 Units [+]Expand course description

ARCH 142 Sustainability Colloquium 1 or 2 Units [+]Expand course description

ARCH 144 Introduction to Acoustics 1 Unit [+]Expand course description

ARCH 149 Special Topics in Energy and Environment 1 - 4 Units [+]Expand course description

ARCH 150 Introduction to Structures 4 Units [+]Expand course description

ARCH 154 Design and Computer Analysis of Structure 3 Units [+]Expand course description

ARCH 155 Structure, Construction, and Space 3 Units [+]Expand course description

ARCH 159 Special Topics in Building Structures 1 - 4 Units [+]Expand course description

ARCH 160 Introduction to Construction 4 Units [+]Expand course description

ARCH 169 Special Topics in Construction Materials 1 - 4 Units [+]Expand course description

ARCH 170A An Historical Survey of Architecture and Urbanism 4 Units [+]Expand course description

ARCH 170B An Historical Survey of Architecture and Urbanism 4 Units [+]Expand course description

ARCH 173 Case Studies in Modern Architecture 3 Units [+]Expand course description

ARCH C174 Architecture in Depression and War 4 Units [+]Expand course description

ARCH 175 Introduction to Architectural Theory 1945-Present 3 Units [+]Expand course description

ARCH 176 American Architecture 3 Units [+]Expand course description

ARCH 177 California Architecture 3 Units [+]Expand course description

ARCH 178 Visionary Architecture 3 Units [+]Expand course description

ARCH 179 Special Topics in the History of Architecture 1 - 4 Units [+]Expand course description

ARCH 188 Utopian Freehand Drawing and Painting: Architecture and the City 3 Units [+]Expand course description

ARCH 198 Special Group Study 1 - 4 Units [+]Expand course description

ARCH 198BC Berkeley Connect 1 Unit [+]Expand course description

ARCH 199 Supervised Independent Study and Research 1 - 4 Units [+]Expand course description

ARCH 200A Introduction to Architecture Studio 1 5 Units [+]Expand course description

ARCH 200B Introduction to Architecture Studio 2 5 Units [+]Expand course description

ARCH 200C Representational Practice in Architectural Design 3 Units [+]Expand course description

ARCH 200D Representational Practice in Architectural Design II 2 Units [+]Expand course description

ARCH 201 Architecture & Urbanism Design Studio 5 Units [+]Expand course description

ARCH 202 Graduate Option Studio 5 Units [+]Expand course description

ARCH 203 Integrated Design Studio 5 Units [+]Expand course description

ARCH 204 Final Project Studio: Studio Thesis Option 5 Units [+]Expand course description

ARCH 204A Thesis Seminar 3 Units [+]Expand course description

ARCH 204B Thesis Studio 5 Units [+]Expand course description

ARCH 205A Studio One, Fall 5 Units [+]Expand course description

ARCH 205B Studio One, Spring 5 Units [+]Expand course description

ARCH 207A Architecture Lectures Colloquium 1 Unit [+]Expand course description

ARCH 207B Architecture Research Colloquium 1 Unit [+]Expand course description

ARCH 207C Professional Practice Colloquium 1 Unit [+]Expand course description

ARCH 207D The Cultures of Practice 3 Units [+]Expand course description

ARCH 209 Special Topics in Architectural Design 1 - 4 Units [+]Expand course description

ARCH 211 Theory and Methods in the Social and Cultural Basis of Design 3 - 4 Units [+]Expand course description

ARCH 212 Body-Conscious Design: Shoes, Chairs, Rooms, and Beyond 3 Units [+]Expand course description

ARCH 215 Landscape, Architecture, Infrastructure, and Urbanism 3 Units [+]Expand course description

ARCH 216 The Sociology of Taste in Environmental Design 3 Units [+]Expand course description

ARCH 217 Social Aspects of Housing Design: Mid-Rise Urbanism 3 Units [+]Expand course description

ARCH 218 Housing, Urbanization, and Urbanism: Design, Planning, and Policy Issues in Developing Countries 4 Units [+]Expand course description

ARCH 219 Special Topics in the Social and Cultural Basis of Design 1 - 4 Units [+]Expand course description

ARCH 221 Graduate Seminar in Digital Design Theories and Methods 3 Units [+]Expand course description

ARCH 222 Principles of Computer Aided Architectural Design 4 Units [+]Expand course description

ARCH 226 Collaboration by Digital Design 3 Units [+]Expand course description

ARCH 227 Workshop in Designing Virtual Places 4 Units [+]Expand course description

ARCH 229 Special Topics in Digital Design Theories and Methods 1 - 4 Units [+]Expand course description

ARCH 229A Introduction to Construction Law 1 - 4 Units [+]Expand course description

ARCH 230 Advanced Architectural Design Theory and Criticism 3 Units [+]Expand course description

ARCH 231 Research Methods in Architectural Design Theory and Criticism 2 Units [+]Expand course description

ARCH 233 Architectures of Globalization: Contested Spaces of Global Culture 3 Units [+]Expand course description

ARCH 236 The Literature of Space 3 Units [+]Expand course description

ARCH 237 Ulterior Speculation: Monographs and Manifestos 3 Units [+]Expand course description

ARCH 238 The Dialectic of Poetics and Technology 3 Units [+]Expand course description

ARCH 239 Special Topics in Architecture Design Theory and Criticism 1 - 4 Units [+]Expand course description

ARCH 240 Advanced Study of Energy and Environment 3 Units [+]Expand course description

ARCH 241 Research Methods in Building Sciences 3 Units [+]Expand course description

ARCH 242 Sustainability Colloquium 1 or 2 Units [+]Expand course description

ARCH 243 Natural Cooling: Sustainable Design for a Warming Planet 3 Units [+]Expand course description

ARCH 244 Mechanical Systems Design for Sustainable Buildings 3 Units [+]Expand course description

ARCH 245 Daylighting in Architecture 3 Units [+]Expand course description

ARCH 246 Building Energy Simulations 3 Units [+]Expand course description

ARCH 249 Special Topics in the Physical Environment in Buildings 1 - 4 Units [+]Expand course description

ARCH 250 Introduction to Structures 3 Units [+]Expand course description

ARCH 252 Form and Structure 3 Units [+]Expand course description

ARCH 253 Seismic Design and Construction 3 Units [+]Expand course description

ARCH 255 Structure, Construction, and Space 3 Units [+]Expand course description

ARCH 256 Structural Design in the Studio 1 - 3 Units [+]Expand course description

ARCH 258 Robotic Fabrication and Construction 3 Units [+]Expand course description

ARCH 259 Special Topics in Building Structures 1 - 4 Units [+]Expand course description

ARCH 259X Special Topics: Building Structures 1 - 4 Units [+]Expand course description

ARCH 260 Introduction to Construction, Graduate Level 3 Units [+]Expand course description

ARCH 262 Architecture in Detail 3 Units [+]Expand course description

ARCH 264 Off-Site Fabrication: Opportunities and Evils 3 Units [+]Expand course description

ARCH 265 Japanese Craft and Construction 3 Units [+]Expand course description

ARCH 269 Special Topics in Construction and Materials 1 - 4 Units [+]Expand course description

ARCH 270 History of Modern Architecture 3 Units [+]Expand course description

ARCH 271 Methods in Historical Research and Criticism in Architecture 4 Units [+]Expand course description

ARCH 273 Case Studies in Modern Architecture 3 Units [+]Expand course description

ARCH 275 Introduction to Architectural Theory 1945 - Present 3 Units [+]Expand course description

ARCH 276 Spaces of Recreation and Leisure, 1850-2000 3 Units [+]Expand course description

ARCH 277 California Architecture 3 Units [+]Expand course description

ARCH 278 Visionary Architecture 3 Units [+]Expand course description

ARCH 279 Special Topics in the History of Architecture 1 - 4 Units [+]Expand course description

ARCH 281 Methods of Inquiry in Architectural Research 4 Units [+]Expand course description

ARCH 290 Dissertation Writing Seminar in Architectural History, Theory, and Society 4 Units [+]Expand course description

ARCH 298 Special Group Study 1 - 4 Units [+]Expand course description

ARCH 299 Individual Study and Research for Master's and Doctoral Students 1 - 12 Units [+]Expand course description

ARCH 375 Seminar in the Teaching of Architecture 2 Units [+]Expand course description

ARCH 602 Individual Study for Doctoral Students 1 - 8 Units [+]

ARMENI 1A Introductory Armenian 3 Units [+]Expand course description

ARMENI 1B Introductory Armenian 3 Units [+]Expand course description

ARMENI 101A Continuing Armenian 3 Units [+]Expand course description

ARMENI 101B Continuing Armenian 3 Units [+]Expand course description

ARMENI 102 Advanced Readings in Specialized Armenian 4 Units [+]Expand course description

ARMENI 124 Armenian Literature in Social Context 4 Units [+]Expand course description

ARMENI 126 Armenian Culture and Film 4 Units [+]Expand course description

ARMENI 128 Arts and Culture in Armenia and the Diaspora Since 1991 3 Units [+]Expand course description

HISTART R1B Reading and Writing about Visual Experience 4 Units [+]Expand course description

HISTART 10 Introduction to Western Art: Ancient to Medieval 4 Units [+]Expand course description

HISTART 10B History of Western Art: Renaissance to Modern 3 Units [+]Expand course description

HISTART N10 Introduction to Western Art: Ancient to Medieval 3 Units [+]Expand course description

HISTART 11 Introduction to Western Art: Renaissance to the Present 4 Units [+]Expand course description

HISTART C11 Introduction to Western Art: Renaissance to the Present 4 Units [+]Expand course description

HISTART N11 Western Art from the Renaissance to the Present 4 Units [+]Expand course description

HISTART 12 History of Western Art: Renaissance to Modern 3 Units [+]Expand course description

HISTART 14 The Origins of Art 4 Units [+]Expand course description

HISTART 15A London Museums 4 Units [+]Expand course description

HISTART 16 Extinction and Visual Culture 4 Units [+]Expand course description

HISTART 17 Art--Take, Break, and Fake It 4 Units [+]Expand course description

HISTART 18 Art and Climate Change 4 Units [+]Expand course description

HISTART 21 Beauty and Truth in Islamic Art 4 Units [+]Expand course description

HISTART 24 Freshman Seminar 1 Unit [+]Expand course description

HISTART 27 Visual Cultures of Africa 4 Units [+]Expand course description

HISTART 30 Introduction to the Art and Architecture of South and Southeast Asia 4 Units [+]Expand course description

HISTART N31 Arts of East Asia 3 Units [+]Expand course description

HISTART 32 The Arts of Korea 4 Units [+]Expand course description

HISTART 33 Buddhist Art of Asia 3 Units [+]Expand course description

HISTART 34 Arts of China 4 Units [+]Expand course description

HISTART 35 Art and Architecture in Japan 4 Units [+]Expand course description

HISTART 36 ASIA MODERN: Art + Architecture, 1800-present 4 Units [+]Expand course description

HISTART 37 Contemporary Art + Architecture from Asia, ca. 1945-present 4 Units [+]Expand course description

HISTART 38 Eco Art History in Asia 4 Units [+]Expand course description

HISTART 39 Freshman/Sophomore Seminar 1.5 - 2 Units [+]Expand course description

HISTART 39A Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39B Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39C Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39D Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39E Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39F Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39G Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39H Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39I Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39J Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39K Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39L Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39M Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39N Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39O Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39P Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39Q Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39R Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39S Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39T Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39U Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39V Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39W Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39X Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39Y Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 39Z Freshman/Sophomore Seminar 1.5 - 4 Units [+]Expand course description

HISTART 41 Introduction to Greek and Roman Art 4 Units [+]Expand course description

HISTART 51 Introduction to Medieval Art 4 Units [+]Expand course description

HISTART 62 Introduction to Italian Renaissance Art 4 Units [+]Expand course description

HISTART C62 Introduction to Italian Renaissance Art 4 Units [+]Expand course description

HISTART 65 Arts of the Renaissance and Reformation 3 Units [+]Expand course description

HISTART 80 Introduction to Modern Art 4 Units [+]Expand course description

HISTART N80 Introduction to Modern Art 3 Units [+]Expand course description

HISTART 87AC Visual Cultures of California 4 Units [+]Expand course description

HISTART 88 Arts of Latin America 4 Units [+]Expand course description

HISTART 91 The Image as Data 4 Units [+]Expand course description

HISTART 98 Directed Group Study for Freshmen and Sophomores 1 - 4 Units [+]Expand course description

HISTART 100 Theories and Methods of Art History 4 Units [+]Expand course description

HISTART N100 Theories and Methods of Art History 4 Units [+]Expand course description

HISTART 101 Theories & Methods for a Global History of Art 4 Units [+]Expand course description

HISTART N104 Gender and Representation 3 Units [+]Expand course description

HISTART 105 Eco Art: Art, Architecture, and the Natural Environment 4 Units [+]Expand course description

HISTART C106 Art and Ecology 4 Units [+]Expand course description

HISTART 107 Images and the Law 4 Units [+]Expand course description

HISTART N107 Images and the Law 3 Units [+]Expand course description

HISTART 108 Cities and the Arts 4 Units [+]Expand course description

HISTART 109 Digital Humanities, Visual Cultures 4 Units [+]Expand course description

HISTART C109 Digital Humanities, Visual Cultures 4 Units [+]Expand course description

HISTART C110 Conversion and Negotiation 4 Units [+]Expand course description

HISTART 120 The "Origins" of Art 3 Units [+]Expand course description

HISTART C120A The Art of Ancient Mesopotamia: 3500-1000 BCE 4 Units [+]Expand course description

HISTART C120B The Art of Ancient Mesopotamia: 1000-330 BCE 4 Units [+]Expand course description

HISTART C121A Topics in Islamic Art 4 Units [+]Expand course description

HISTART 127 The Arts of Africa 3 Units [+]Expand course description

HISTART 130A Early Chinese Art, Part I 4 Units [+]Expand course description

HISTART 131A Sacred Arts in China 4 Units [+]Expand course description

HISTART 131B The Classical Painting Tradition in China 4 Units [+]Expand course description

HISTART 131C Art and Propaganda in Modern China 4 Units [+]Expand course description

HISTART 132AC AsiaAmerica: Asian American Art and Architecture 4 Units [+]Expand course description

HISTART 134A Topics in Buddhist Art and Architecture: Buddhist Temple Art &amp; Architecture in Japan 4 Units [+]Expand course description

HISTART 134B Topics in Buddhist Art and Architecture: Buddhist Icons in Japan 4 Units [+]Expand course description

HISTART 134C Topics in Buddhist Art and Architecture: Buddhist Art in the Modern/Contemporary World 4 Units [+]Expand course description

HISTART 136A South Asian Art: Ancient 4 Units [+]Expand course description

HISTART 136B South Asian Art: Early Modern 4 Units [+]Expand course description

HISTART 136C The Art of India: 1350 A.D. to the Present 4 Units [+]Expand course description

HISTART 137 The Art of Southeast Asia 4 Units [+]Expand course description

HISTART C140 Minoan and Mycenaean Art 4 Units [+]Expand course description

HISTART 141A The Art of Ancient Greece: Archaic Greek Art and Architecture (750-480 B.C.) 4 Units [+]Expand course description

HISTART 141B The Art of Ancient Greece: Classical Greek Art and Architecture (500-320 B.C.) 4 Units [+]Expand course description

HISTART 141C The Art of Ancient Greece: Hellenistic Art and Architecture (330-30 B.C.) 4 Units [+]Expand course description

HISTART N142 Introduction to Archaeology: The Tel Dor Excavation 2 or 4 Units [+]Expand course description

HISTART 145 Roman Art 4 Units [+]Expand course description

HISTART 145A Roman Painting 4 Units [+]Expand course description

HISTART 145B Ancient Portraiture and Biography 4 Units [+]Expand course description

HISTART C145A Pictorial Representation in the Roman World 4 Units [+]Expand course description

HISTART 151 Art in Late Antiquity 4 Units [+]Expand course description

HISTART 155A Relics, Reliquaries and Cult Images 4 Units [+]Expand course description

HISTART 156A Gothic Art in Northern Europe: 1150-1270 4 Units [+]Expand course description

HISTART 156C Art and Science 4 Units [+]Expand course description

HISTART C156B Art and Science 4 Units [+]Expand course description

HISTART C158 Art and Science 4 Units [+]Expand course description

HISTART 160 Renaissance Art in Florence 1400-1600 4 Units [+]Expand course description

HISTART 161 Renaissance Art in Rome 1400-1600 4 Units [+]Expand course description

HISTART 162 Renaissance Art in Venice 1400-1600 4 Units [+]Expand course description

HISTART 166 Van Eyck to Brueghel 4 Units [+]Expand course description

HISTART 169A Elizabethan Renaissance: Art, Culture, and Visuality 4 Units [+]Expand course description

HISTART 170 Southern Baroque Art 4 Units [+]Expand course description

HISTART 171 Visual Culture in Early Modern Spain and Colonial Latin America 4 Units [+]Expand course description

HISTART 172 The Dutch Golden Age 4 Units [+]Expand course description

HISTART 173 The Age of Rubens 4 Units [+]Expand course description

HISTART 174 Types of Dutch and Flemish Painting in the 17th Century 4 Units [+]Expand course description

HISTART 175 Visual Culture in Early Modern France: Renaissance to Enlightenment 4 Units [+]Expand course description

HISTART 179 Eighteenth-Century British Art 3 Units [+]Expand course description

HISTART 180A Nineteenth-Century Europe: Age of Revolution 4 Units [+]Expand course description

HISTART 180C Nineteenth-Century Europe: The Invention of Avant-Gardes 4 Units [+]Expand course description

HISTART N180A 19th-Century Europe: Age of Revolution 3 Units [+]Expand course description

HISTART N180B The Body in Avant-Garde French Art 3 Units [+]Expand course description

HISTART N180C Nineteenth-Century Europe: The Invention of Avant-Gardes 3 Units [+]Expand course description

HISTART N181 French Art of the 19th Century 3 Units [+]Expand course description

HISTART 182 Histories of Photography 4 Units [+]Expand course description

HISTART N182 Histories of Photography 3 Units [+]Expand course description

HISTART 183 Art and Colonialism 4 Units [+]Expand course description

HISTART 183E American Painting and Photography from the Civil War to WW II 3 Units [+]Expand course description

HISTART 185 From Manet to Mondrian 3 Units [+]Expand course description

HISTART 185A American Art (1800-Present) 4 Units [+]Expand course description

HISTART 185B American Architecture: Domestic Forms 4 Units [+]Expand course description

HISTART 185D The Transatlantic Gilded Age and Its Discontents 4 Units [+]Expand course description

HISTART N185C Contemporary American Art 3 Units [+]Expand course description

HISTART 186A Art in the Early 20th Century 4 Units [+]Expand course description

HISTART 186C Art in the Later 20th Century 4 Units [+]Expand course description

HISTART N186C Art in the Later 20th Century 3 Units [+]Expand course description

HISTART 187AC Race and Representation in the Twentieth Century in the United States 4 Units [+]Expand course description

HISTART 188 Latin American Art 4 Units [+]Expand course description

HISTART 188A Latin American Art: Before Columbus 4 Units [+]Expand course description

HISTART 188C Art and Resistance across Latin America (1960-1990s) 4 Units [+]Expand course description

HISTART 189 Museums: An Introduction to the History and Practice of Collecting and the Public View 1 Unit [+]Expand course description

HISTART C189 The American Forest: Its Ecology, History, and Representation 4 Units [+]Expand course description

HISTART 190A Special Topics in Fields of Art History: Asian 4 Units [+]Expand course description

HISTART 190B Special Topics in Fields of Art History: Ancient 4 Units [+]Expand course description

HISTART 190C Special Topics in Fields of Art History: Medieval 4 Units [+]Expand course description

HISTART 190D Special Topics in Fields of Art History: 15th-16th Century 4 Units [+]Expand course description

HISTART 190DH Digital Humanities for Art Historians 6 Units [+]Expand course description

HISTART 190E Special Topics in Fields of Art History: 17th-18th Century 4 Units [+]Expand course description

HISTART 190F Special Topics in Fields of Art History: 19th-20th Century 3 - 4 Units [+]Expand course description

HISTART 190G Special Topics in Fields of Art History: American/British 4 Units [+]Expand course description

HISTART 190H Special Topics in Fields of Art History: Contemporary 4 Units [+]Expand course description

HISTART 190M Special Topics in Fields of Art History: Global Modernism 4 Units [+]Expand course description

HISTART N190A Special Topics in Fields of Art History: Asian 3 Units [+]Expand course description

HISTART N190B Special Topics in Fields of Art History: Ancient 3 Units [+]Expand course description

HISTART N190C Special Topics in Fields of Art History: Medieval 3 Units [+]Expand course description

HISTART N190D Special Topics in Fields of Art History: 15th-16th Century 3 Units [+]Expand course description

HISTART N190E Special Topics in Fields of Art History: 17th-18th Century 3 Units [+]Expand course description

HISTART N190F Special Topics in Fields of Art History: 19th-20th Century 3 Units [+]Expand course description

HISTART N190G Special Topics in Fields of Art History: American/British 3 Units [+]Expand course description

HISTART N190H Special Topics in Fields of Art History: Precolumbian/Latin American 3 Units [+]Expand course description

HISTART 190T Transcultural 4 Units [+]Expand course description

HISTART 192A Undergraduate Seminar: Problems in Research and Interpretation: Asian 2 or 4 Units [+]Expand course description

HISTART 192AC Undergraduate Seminar: Folk Art in America 4 Units [+]Expand course description

HISTART 192B Undergraduate Seminar: Problems in Research and Interpretation: Ancient 4 Units [+]Expand course description

HISTART 192C Undergraduate Seminar: Problems in Research and Interpretation: Medieval 4 Units [+]Expand course description

HISTART 192CU Undergraduate Seminar: Problems in Research and Interpretation: Curatorial 4 Units [+]Expand course description

HISTART 192D Undergraduate Seminar: Problems in Research and Interpretation: 15th-16th Century 4 Units [+]Expand course description

HISTART 192DH Undergraduate Seminar: Digital Imaging and Forensic Art History 4 Units [+]Expand course description

HISTART 192E Undergraduate Seminar: Problems in Research and Interpretation: 17th-18th Century 2 or 4 Units [+]Expand course description

HISTART 192F Undergraduate Seminar: Problems in Research and Interpretation: 19th-20th Century 2 or 4 Units [+]Expand course description

HISTART 192G Undergraduate Seminar: Problems in Research and Interpretation: Undergraduate Seminar: American Art, Architecture, and Design 2 or 4 Units [+]Expand course description

HISTART 192H Undergraduate Seminar: Problems in Research and Interpretation: Modern/Contemporary Art 4 Units [+]Expand course description

HISTART 192HD Digital Art History and Cultural Heritage 4 Units [+]Expand course description

HISTART 192L Undergraduate Seminar: Latin American 4 Units [+]Expand course description

HISTART 192M Undergraduate Seminar: Problems in Research and Interpretation: Global Modernism 4 Units [+]Expand course description

HISTART 192T Undergraduate Seminar: Problems in Research and Interpretation: Transcultural 4 Units [+]Expand course description

HISTART 193 Directed Research 4 Units [+]Expand course description

HISTART 194 Museum Internship 1 - 4 Units [+]Expand course description

HISTART H195 Special Study for Honors Candidates in the History of Art 4 Units [+]Expand course description

HISTART C196A UCDC Core Seminar 4 Units [+]Expand course description

HISTART C196B UCDC Internship 6.5 Units [+]Expand course description

HISTART C196W Special Field Research 10.5 Units [+]Expand course description

HISTART 198 Supervised Group Study 1 - 4 Units [+]Expand course description

HISTART 199 Supervised Independent Study 1 - 4 Units [+]Expand course description

HISTART N199 Supervised Independent Study 1 - 4 Units [+]Expand course description

HISTART 200 Graduate Proseminar in the Interpretation of Art Historical Materials 2 or 4 Units [+]Expand course description

HISTART 203 Seminar in Material Culture: The Interpretation of Objects 2 or 4 Units [+]Expand course description

HISTART C204 Proseminar in Classical Archaeology and Ancient Art 2 or 4 Units [+]Expand course description

HISTART C220 Seminar in Middle Eastern Art 2 or 4 Units [+]Expand course description

HISTART 230 Seminar in Chinese Art 2 or 4 Units [+]Expand course description

HISTART 234 Seminar in Japanese Art 2 or 4 Units [+]Expand course description

HISTART 236 Seminar in the Art of India 2 or 4 Units [+]Expand course description

HISTART 240 Seminar in Greek Art 2 or 4 Units [+]Expand course description

HISTART 258 Seminar in Late Medieval Art in Northern Europe 2 or 4 Units [+]Expand course description

HISTART 260 Seminar in Italian Renaissance Art 2 or 4 Units [+]Expand course description

HISTART 262 Seminar in European Art 2 or 4 Units [+]Expand course description

HISTART 263 Seminar in European Art: Mimesis 2 or 4 Units [+]Expand course description

HISTART 270 Seminar in Baroque Art 2 or 4 Units [+]Expand course description

HISTART 281 Seminar in 19th-Century Art 2 or 4 Units [+]Expand course description

HISTART 285 Seminar in 20th-Century Art 2 or 4 Units [+]Expand course description

HISTART 286 Seminar in 20th-Century Painting and Sculpture 2 or 4 Units [+]Expand course description

HISTART C288 The Arts of Migration, Vernacular Arts 2 or 4 Units [+]Expand course description

HISTART 289 Seminar in American Art 2 or 4 Units [+]Expand course description

HISTART 290 Special Topics in Fields of Art History 2 or 4 Units [+]Expand course description

HISTART 291 Judith Stronach Graduate Travel Seminar in Art History 4 Units [+]Expand course description

HISTART 296 Directed Dissertation Research 3 - 12 Units [+]Expand course description

HISTART 298 Group Study for Graduate Students in the History of Art 1 - 4 Units [+]Expand course description

HISTART 299 Special Study for Graduate Students in the History of Art 1 - 12 Units [+]Expand course description

HISTART 300 Supervised Teaching of History of Art 1 - 5 Units [+]Expand course description

HISTART 375 Seminar in History of Art Teaching 2 Units [+]Expand course description

HISTART 601 Individual Study for Master's Students in the History of Art 1 - 12 Units [+]Expand course description

HISTART 602 Individual Study for Doctoral Students in the History of Art 1 - 12 Units [+]Expand course description

ART 8 Introduction to Visual Thinking 4 Units [+]Expand course description

ART 8A Introduction to Visual Thinking 4 Units [+]Expand course description

ART 12 Drawing: Foundations 4 Units [+]Expand course description

ART 13 Painting: Foundations 4 Units [+]Expand course description

ART 14 Sculpture: Foundations 4 Units [+]Expand course description

ART 15 Ceramics: Foundations 4 Units [+]Expand course description

ART 16 Printmaking (Relief & Intaglio): Foundations 4 Units [+]Expand course description

ART 17 Printmaking (Lithography & Screen Printing): Foundations 4 Units [+]Expand course description

ART 21 Digital Photography: Foundations 4 Units [+]Expand course description

ART 23AC DIGITAL MEDIA: FOUNDATIONS 4 Units [+]Expand course description

ART W23AC Data Arts 4 Units [+]Expand course description

ART 25 Graphic Novel: Foundations 4 Units [+]Expand course description

ART 26 Moving Image: Foundations 4 Units [+]Expand course description

ART 30 Art, Water and California 3 Units [+]Expand course description

ART 98 Directed Group Study 1 - 3 Units [+]Expand course description

ART 99 Supervised Independent Study 1 - 2 Units [+]Expand course description

ART 100 Collaborative Innovation 4 Units [+]Expand course description

ART C100 Art and Ecology 4 Units [+]Expand course description

ART 102 Advanced Painting: Research and Methods 4 Units [+]Expand course description

ART 103 Advanced Painting: Reconsidering the Portrait & Figure 4 Units [+]Expand course description

ART 116 Ancient Pigments & Contemporary Drawing Practices 4 Units [+]Expand course description

ART 117 Advanced Drawing: Research and Methods 4 Units [+]Expand course description

ART N117 Drawing and Composition 3 Units [+]Expand course description

ART 118 Advanced Drawing: Remixing the Figure 4 Units [+]Expand course description

ART 119 Global Perspectives in Contemporary Art 4 Units [+]Expand course description

ART 120 Advanced Printmaking: Intaglio 4 Units [+]Expand course description

ART 122 Advanced Printmaking: Lithography 4 Units [+]Expand course description

ART 123 Advanced Printmaking: Screen Print 4 Units [+]Expand course description

ART 124 Advanced Projects in Printmaking 4 Units [+]Expand course description

ART 130 Advanced Sculpture: Concept and Construction 4 Units [+]Expand course description

ART 132 Advanced Ceramics: Research and Methods 4 Units [+]Expand course description

ART 133 Advanced Sculpture: Meaning in Material 4 Units [+]Expand course description

ART 136 Advanced Sculpture: Radical Wearables 4 Units [+]Expand course description

ART 137 Advanced Projects in Ceramic Sculpture 4 Units [+]Expand course description

ART 138 Advanced Sculpture: Installation 4 Units [+]Expand course description

ART 141 Temporal Structures: Video and Performance Art 4 Units [+]Expand course description

ART 142 New Genres 4 Units [+]Expand course description

ART 145 Contemporary Rituals: New Forms in Performance Art and Video 4 Units [+]Expand course description

ART 160 Special Topics in Visual Studies 4 Units [+]Expand course description

ART N160 Creative Research Studio 6 Units [+]Expand course description

ART 162 Issues in Cultural Display: Studio and Post-Studio Art Practices 4 Units [+]Expand course description

ART 163 Social Practice: Critical Site and Context 4 Units [+]Expand course description

ART N163 Social Practice: Critical Site and Context--ESCUELA de ARTE UTIL 6 Units [+]Expand course description

ART 164 Art and Meditation 4 Units [+]Expand course description

ART 165 Art, Medicine, and Disabilities 4 Units [+]Expand course description

ART 166 Social Practice Research Studio 4 Units [+]Expand course description

ART C166 Critical Practices: People, Places, Participation 4 Units [+]Expand course description

ART 171 Video Projects 4 Units [+]Expand course description

ART N171 Digital Video: The Architecture of Time 4 Units [+]Expand course description

ART 172 Advanced Digital Media: Computer Graphics Studio 4 Units [+]Expand course description

ART 173 Electro-Crafting 4 Units [+]Expand course description

ART 174 Advanced Digital Video 4 Units [+]Expand course description

ART 178 Advanced Digital Media: Game Design Methods 4 Units [+]Expand course description

ART 180 Advanced Digital Photography 4 Units [+]Expand course description

ART 182 Creative Writing for Artists 4 Units [+]Expand course description

ART 184 Junior Seminar: Meaning and Making 4 Units [+]Expand course description

ART 185 Senior Projects/Professional Practices 4 Units [+]Expand course description

ART H195A Special Study for Honors Candidates in the Practice of Art 4 Units [+]Expand course description

ART H195B Special Study for Honors Candidates in the Practice of Art 4 Units [+]Expand course description

ART 196 Bridging the Arts Seminar 1 - 4 Units [+]Expand course description

ART 198 Directed Group Study 1 - 3 Units [+]Expand course description

ART 199 Supervised Independent Study for Advanced Undergraduates 1 - 4 Units [+]Expand course description

ART N199 Supervised Independent Study for Advanced Undergraduates 1 - 3 Units [+]Expand course description

ART 218 Seminar: Theory and Criticism 4 Units [+]Expand course description

ART 229 NEW MEDIA METHODS 3 Units [+]Expand course description

ART 290 Independent Study 4 Units [+]Expand course description

ART 294 Seminar for M.F.A. Students 4 Units [+]Expand course description

ART 295 Independent Study for M.F.A. Students 4 - 12 Units [+]Expand course description

ART 298 Directed Group Study 4 Units [+]Expand course description

ART 299 Supervised Independent Study for Graduate Students 1 - 4 Units [+]Expand course description

ART 301 The Teaching of Art: Practice 1 Unit [+]

HUM R1A Global Humanities I: From California to the Global 4 Units [+]Expand course description

HUM R1B Global Humanities: Old World, New World, Our World 4 Units [+]Expand course description

HUM 10 Compass Course 4 Units [+]Expand course description

HUM 12 Berkeley Changemaker: Humanists at Work 2 or 4 Units [+]Expand course description

HUM 20 Explorations in Arts + Design at Berkeley 1 Unit [+]Expand course description

HUM 98 Directed Group Study 1 - 3 Units [+]Expand course description

HUM 100 Transfer Foundations 4 Units [+]Expand course description

HUM 101 Beyond Google: How to Research in the Humanities 4 Units [+]Expand course description

HUM 105 Arts Entrepreneurship 3 Units [+]Expand course description

HUM 120 Entrepreneurship for All: An Insiders' Guide to Startups 3 Units [+]Expand course description

HUM 132AC Future Histories Studio: Revealing the Past, Imagining the Future 3 - 4 Units [+]Expand course description

HUM C132 Future Histories Studio: Revealing the Past, Imagining the Future 3 - 4 Units [+]Expand course description

HUM 133AC Hidden in Plain Sight: Public History in Public Space 3 Units [+]Expand course description

HUM 196 Mentored Research 3 Units [+]Expand course description

HUM 197 Internship 2 - 4 Units [+]Expand course description

HUM 198 Directed Group Study 1 - 3 Units [+]Expand course description

HUM 199 Independent Study 1 - 4 Units [+]Expand course description

HUM 220 Humanities-Tech Colloquium 2 Units [+]Expand course description

HUM 290 Colloquium: Practicing the Humanities 1 Unit [+]Expand course description

HUM 291 Teaching Writing: Theory, History and Practice 4 Units [+]Expand course description

HUM 295 Collaborative Research Seminar 2 Units [+]Expand course description

HUM 299 Special Study 1 - 4 Units [+]Expand course description

ASAMST R2A Reading and Composition 4 Units [+]Expand course description

ASAMST R2B Reading and Composition 4 Units [+]Expand course description

ASAMST 20A Introduction to the History of Asians in the United States 4 Units [+]Expand course description

ASAMST 20AC Asian American Communities and Race Relations 4 Units [+]Expand course description

ASAMST 20B Contemporary Issues in Asian American Communities 4 Units [+]Expand course description

ASAMST 20C Cultural Politics and Practices in Asian American Communities 4 Units [+]Expand course description

ASAMST W20AC Asian American Communities and Race Relations 4 Units [+]Expand course description

ASAMST 24 Freshman Seminar 1 Unit [+]Expand course description

ASAMST 39 Freshman/Sophomore Seminar 1.5 - 2 Units [+]Expand course description

ASAMST 97 Field Studies in Asian American Communities 1 - 3 Units [+]Expand course description

ASAMST 98 Supervised Group Study 1 - 3 Units [+]Expand course description

ASAMST 99 Supervised Independent Study and Research 1 - 4 Units [+]Expand course description

ASAMST 121 Chinese American History 4 Units [+]Expand course description

ASAMST 122 Japanese American History 4 Units [+]Expand course description

ASAMST 123 Korean American History 4 Units [+]Expand course description

ASAMST 124 Filipino American History 4 Units [+]Expand course description

ASAMST 125 Contemporary Issues of Southeast Asian Refugees in the U.S 4 Units [+]Expand course description

ASAMST 126 Southeast Asian Migration and Community Formation 4 Units [+]Expand course description

ASAMST 127 South Asian American Historical and Contemporary Issues 4 Units [+]Expand course description

ASAMST 128AC Muslims in America 4 Units [+]Expand course description

ASAMST 131 Asian Diaspora(s) from an Asian American Perspective 4 Units [+]Expand course description

ASAMST 132 Islamaphobia and Constructing Otherness 4 Units [+]Expand course description

ASAMST 132AC Islamophobia and Constructing Otherness 4 Units [+]Expand course description

ASAMST 138 Topics in Asian Popular Culture 4 Units [+]Expand course description

ASAMST 141 Law in the Asian American Community 4 Units [+]Expand course description

ASAMST 143AC Asian American Health 3 Units [+]Expand course description

ASAMST 143B Advancing Health Equity for Asian American, Native Hawaiian, and Pacific Islander Communities 4 Units [+]Expand course description

ASAMST 144 Religions of Asian America 4 Units [+]Expand course description

ASAMST 145 Politics, Public Policy, and Asian American Communities 4 Units [+]Expand course description

ASAMST 145AC Politics, Public Policy, and Asian American Communities 4 Units [+]Expand course description

ASAMST 146 Asian Americans and Education 4 Units [+]Expand course description

ASAMST 150 Gender and Generation in Asian American Families 4 Units [+]Expand course description

ASAMST 151 Asian American Women: Theory and Experience 4 Units [+]Expand course description

ASAMST 151AC Asian American Women: Theory and Experience 4 Units [+]Expand course description

ASAMST 152 The Second Generation Asian American Experience 4 Units [+]Expand course description

ASAMST 171 Asian Americans in Film and Video 4 Units [+]Expand course description

ASAMST 172 Asian American Literature 4 Units [+]Expand course description

ASAMST 173 Creative Writing 4 Units [+]Expand course description

ASAMST 175 Contemporary Narratives on the Philippines and the United States 3 Units [+]Expand course description

ASAMST 176 Genre in Asian American Literature 4 Units [+]Expand course description

ASAMST 178 Gender and Sexuality in Asian American Literature and Culture 4 Units [+]Expand course description

ASAMST 181 Chinese American Literature 4 Units [+]Expand course description

ASAMST 183 Korean American Literature 4 Units [+]Expand course description

ASAMST 190 Seminar on Advanced Topics in Asian American Studies 4 Units [+]Expand course description

ASAMST 194A Asian Pacific American Theme Program Seminar 2 Units [+]Expand course description

ASAMST 194B Asian Pacific American Theme Program Seminar 2 Units [+]Expand course description

ASAMST 195 Senior Thesis 4 Units [+]Expand course description

ASAMST H195A Senior Honors Thesis for Asian American and Asian Diaspora Studies Majors 3 Units [+]Expand course description

ASAMST H195B Senior Honors Thesis for Asian American and Asian Diaspora Studies Majors 3 Units [+]Expand course description

ASAMST 197 Field Study in Asian American and Asian Diaspora Studies 1 - 3 Units [+]Expand course description

ASAMST 198 Supervised Group Study 1 - 3 Units [+]Expand course description

ASAMST 199 Supervised Independent Study and Research 1 - 4 Units [+]

ASIANST 98 Directed Group Study 1 - 4 Units [+]Expand course description

ASIANST H195A Senior Honors 3 Units [+]Expand course description

ASIANST H195B Senior Honors 3 Units [+]Expand course description

ASIANST 197 Field Studies 2 - 4 Units [+]Expand course description

ASIANST 198 Directed Group Study 1 - 4 Units [+]Expand course description

ASIANST 199 Independent Study 1 - 4 Units [+]Expand course description

ASIANST 201 Asian Studies Proseminar 1 Unit [+]Expand course description

ASIANST 298 Directed Group Study 2 - 6 Units [+]Expand course description

ASIANST 299 Independent Study 1 - 7 Units [+]Expand course description

ASTRON 3 Introduction to Modern Cosmology 2 Units [+]Expand course description

ASTRON 7A Introduction to Astrophysics 4 Units [+]Expand course description

ASTRON 7AB Introduction to Astrophysics: From Planets to Cosmology 4 Units [+]Expand course description

ASTRON 7B Introduction to Astrophysics 4 Units [+]Expand course description

ASTRON 9 Selected Topics in Astronomy 3 Units [+]Expand course description

ASTRON 10 Introduction to General Astronomy 4 Units [+]Expand course description

ASTRON C10 Introduction to General Astronomy 4 Units [+]Expand course description

ASTRON N10 Introduction to General Astronomy 3 Units [+]Expand course description

ASTRON C12 The Planets 3 Units [+]Expand course description

ASTRON W12 The Planets 3 Units [+]Expand course description

ASTRON C13 Origins: from the Big Bang to the Emergence of Humans 4 Units [+]Expand course description

ASTRON 24 Freshman Seminars 1 Unit [+]Expand course description

ASTRON 39 Seminar 1.5 Unit [+]Expand course description

ASTRON 84 Sophomore Seminar 1 or 2 Units [+]Expand course description

ASTRON 98 Directed Group Study 1 - 4 Units [+]Expand course description

ASTRON 99 Directed Study in Astronomy 1 - 3 Units [+]Expand course description

ASTRON C101 Order-Of-Magnitude Physics 4 Units [+]Expand course description

ASTRON 120 Optical and Infrared Astronomy Laboratory 4 Units [+]Expand course description

ASTRON 121 Radio Astronomy Laboratory 4 Units [+]Expand course description

ASTRON 128 Astronomy Data Science Laboratory 4 Units [+]Expand course description

ASTRON 160 Stellar Physics 4 Units [+]Expand course description

ASTRON C161 Relativistic Astrophysics and Cosmology 4 Units [+]Expand course description

ASTRON C162 Planetary Astrophysics 4 Units [+]Expand course description

ASTRON 190 Undergraduate Special Topics 3 Units [+]Expand course description

ASTRON H195 Special Study for Honors Candidates 2 - 4 Units [+]Expand course description

ASTRON 198 Directed Group Study 1 - 4 Units [+]Expand course description

ASTRON 199 Supervised Independent Study and Research 1 - 4 Units [+]Expand course description

ASTRON 201 Radiation Processes in Astronomy 4 Units [+]Expand course description

ASTRON C202 Astrophysical Fluid Dynamics 4 Units [+]Expand course description

ASTRON 203 Astrophysical Techniques 3 Units [+]Expand course description

ASTRON 204 Numerical Techniques in Astronomy 3 Units [+]Expand course description

ASTRON C207 Radiation Processes in Astronomy 4 Units [+]Expand course description

ASTRON 218 Stellar Dynamics and Galactic Structure 3 Units [+]Expand course description

ASTRON C228 Extragalactic Astronomy and Cosmology 3 Units [+]Expand course description

ASTRON C249 Solar System Astrophysics 3 Units [+]Expand course description

ASTRON 250 Special Topics in Astrophysics 3 Units [+]Expand course description

ASTRON 252 Stellar Structure and Evolution 3 Units [+]Expand course description

ASTRON C254 High Energy Astrophysics 3 Units [+]Expand course description

ASTRON 255 Computational Methods in Theoretical Astrophysics 3 Units [+]Expand course description

ASTRON 256 Astronomy Data Science Laboratory 4 Units [+]Expand course description

ASTRON C285 Theoretical Astrophysics Seminar 1 Unit [+]Expand course description

ASTRON 290A Introduction to Current Research 2 Units [+]Expand course description

ASTRON 290B Introduction to Current Research 1 Unit [+]Expand course description

ASTRON C290C Cosmology 2 Units [+]Expand course description

ASTRON 292 Seminar 1 - 2 Units [+]Expand course description

ASTRON C292 Planetary Science Seminar 1 Unit [+]Expand course description

ASTRON 298 Directed Group Study 1 - 4 Units [+]Expand course description

ASTRON 299 Advanced Study and Research 2 - 12 Units [+]Expand course description

ASTRON 301 Undergraduate Astronomy Instruction 1 - 2 Units [+]Expand course description

ASTRON 602 Individual Study for Doctoral Students 1 - 8 Units [+]Expand course description
)";

    std::regex regex(R"(([A-Z]+(?: [A-Z]+)*)\s(\d+[A-Z]?))");

    std::smatch match;
    std::map<std::string, std::vector<std::string> > classNumbers;

    auto inputBegin = std::sregex_iterator(input.begin(), input.end(), regex);
    auto inputEnd = std::sregex_iterator();

    for (std::sregex_iterator it = inputBegin; it != inputEnd; ++it) {
        std::string className = (*it)[1].str();
        std::string classNumber = (*it)[2].str();

        classNumbers[className].push_back(classNumber);
    }

    for (const auto& pair : classNumbers) {
        std::cout << pair.first << ": ";
        for (size_t i = 0; i < pair.second.size(); ++i) {
            if (i != 0) {
                std::cout << ", ";
            }
            std::cout << "'" << pair.second[i] << "'";
        }
        std::cout << std::endl << std::endl << std::endl;
    }

    return 0;
}