import { useState, useEffect, useRef } from "react";
import "./garage.css";
import CarIcon from "../../assets/garage/car-top-view.svg?react";
import {
  resetCarPosition,
  startCarAnimation,
} from "../../utils/startCarAnimation";

import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReplayIcon from "@mui/icons-material/Replay";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  createCar,
  deleteCar,
  driveEngine,
  getCars,
  startStopEngine,
  updateCar,
} from "../../api/api";

import type { Car, CreateCar } from "../../ts/interfaces";

const Garage = () => {
  // The cars state
  const [cars, setCars] = useState<Car[]>([]);

  // The new car's states
  const [newCarColor, setNewCarColor] = useState("#000000");
  const [newCarName, setNewCarName] = useState<string>("");

  // The states for the car that's being edited or deleted
  const [editId, setEditId] = useState<number | null>(null);
  const [editCarName, setEditCarName] = useState<string>("");
  const [editCarColor, setEditCarColor] = useState<string>("#000000");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // States for engine and driving
  const [racingIds, setRacingIds] = useState<Set<number>>(new Set());
  const [brokenIds, setBrokenIds] = useState<Set<number>>(new Set());

  const carRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    getCars().then(({ cars }) => setCars(cars));
  }, []);

  // Car editing and creation
  const onCarClick = (id: number) => {
    setEditId(id);
    setEditCarName(cars.find((car) => car.id === id)?.name || "");
    setEditCarColor(cars.find((car) => car.id === id)?.color || "#000000");
  };

  const onSaveCar = (id: number) => {
    if (!editCarName.trim()) return;
    const updatedCar: CreateCar = { name: editCarName, color: editCarColor };
    updateCar(id, updatedCar).then(() => getCars().then(({ cars }) => setCars(cars)));
    setEditId(null);
  };

  const onCreateCar = () => {
    if (!newCarName.trim()) return;
    const newCar: CreateCar = { name: newCarName, color: newCarColor };
    createCar(newCar).then(() => getCars().then(({ cars }) => setCars(cars)));
    setNewCarName("");
    setNewCarColor("#000000");
  };

  const onSetToDelete = (id: number) => {
    setEditId(null);
    setEditCarName("");
    setEditCarColor("#000000");
    setDeleteId(id);
  };

  const onDeleteCar = (id: number) => {
    deleteCar(id).then(() => getCars().then(({ cars }) => setCars(cars)));
  };

  // Engine functions
  const onDriveCar = async (id: number) => {
    if (racingIds.has(id)) return;

    setRacingIds((prev) => new Set(prev).add(id));

    let racingAnimation: ReturnType<typeof startCarAnimation> | null = null;

    try {
      const { velocity } = await startStopEngine(id, "started");

      await new Promise(requestAnimationFrame);

      const carEl = carRefs.current[id];
      if (!carEl) return;

      racingAnimation = startCarAnimation(carEl, velocity);

      await driveEngine(id);

      setBrokenIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("broken down")) {
        racingAnimation?.stop();
        setBrokenIds((prev) => new Set(prev).add(id));
      } else {
        console.error(error);
      }
    }
  };

  const onResetCar = async (id: number) => {
    await startStopEngine(id, "stopped");
    const carEl = carRefs.current[id];
    if (carEl) resetCarPosition(carEl);
    setRacingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setBrokenIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const onStartAll = () => {
    cars.forEach((car) => onDriveCar(car.id));
  };

  const onResetAll = () => {
    cars.forEach((car) => onResetCar(car.id));
  };

  return (
    <div>
      <div className="buttons-container">
        <div className="race-buttons">
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            sx={{ backgroundColor: "var(--red)" }}
            onClick={onStartAll}
          >
            START
          </Button>

          <Button
            variant="contained"
            startIcon={<ReplayIcon />}
            sx={{ backgroundColor: "var(--blue)" }}
            onClick={onResetAll}
          >
            RESET
          </Button>

          <span className="hover-text">
            Click a car's name to edit or delete it!
          </span>
        </div>

        <div className="car-creation-buttons">
          <TextField
            label="Car name"
            variant="outlined"
            size="small"
            sx={{
              "& .MuiInputBase-input": {
                backgroundColor: "white",
                borderRadius: "4px",
              },
              "& .MuiInputLabel-root.MuiInputLabel-shrink": {
                backgroundColor: "white",
                padding: "0 7px",
                marginLeft: "-4px",
                borderRadius: "4px",
              },
            }}
            value={newCarName}
            onChange={(e) => setNewCarName(e.target.value)}
          />

          <input
            type="color"
            className="color-picker"
            value={newCarColor}
            onChange={(e) => setNewCarColor(e.target.value)}
          />

          <Button
            variant="contained"
            sx={{ backgroundColor: "var(--green)" }}
            onClick={onCreateCar}
          >
            CREATE
          </Button>
        </div>
      </div>

      <table className="racetrack-table">
        <tbody>
          {cars.map((car, index) => (
            <tr key={car.id}>
              <td className="start-zone">
                <div className="start-zone-div">
                  <div className="individual-car-buttons">
                    <Button
                      onClick={() => onDriveCar(car.id)}
                      disabled={racingIds.has(car.id)}
                      size="small"
                    >
                      <PlayArrowIcon fontSize="small" />
                    </Button>

                    <Button onClick={() => onResetCar(car.id)} size="small">
                      <ReplayIcon fontSize="small" />
                    </Button>
                  </div>

                  <div className="car-icon-slot">
                    <div
                      className={`car-icon-wrapper${
                        brokenIds.has(car.id) ? " car-icon-wrapper--broken" : ""
                      }${racingIds.has(car.id) ? " car-icon-wrapper--racing" : ""}`}
                      ref={(node) => {
                        carRefs.current[car.id] = node;
                      }}
                    >
                      <CarIcon
                        className="carIcon"
                        width={40}
                        height={40}
                        fill={car.color}
                        stroke="white"
                        strokeWidth={0.5}
                      />
                    </div>
                  </div>
                </div>
              </td>
              {index === 0 && (
                <td className="start-line" rowSpan={cars.length}>
                  START
                </td>
              )}

              <td className="track">
                {editId === car.id ? (
                  <div className="edit-car-container">
                    <TextField
                      variant="outlined"
                      size="small"
                      value={editCarName}
                      onChange={(e) => setEditCarName(e.target.value)}
                      sx={{
                        "& .MuiInputBase-input": {
                          backgroundColor: "white",
                          borderRadius: "4px",
                        },
                      }}
                    />

                    <input
                      type="color"
                      className="color-picker"
                      value={editCarColor}
                      onChange={(e) => setEditCarColor(e.target.value)}
                    />

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--green)" }}
                      onClick={() => onSaveCar(car.id)}
                    >
                      SAVE
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--blue)" }}
                      onClick={() => setEditId(null)}
                    >
                      CANCEL
                    </Button>

                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--red)" }}
                      onClick={() => onSetToDelete(car.id)}
                    >
                      <DeleteIcon />
                    </Button>
                  </div>
                ) : deleteId === car.id ? (
                  <div className="delete-car-container">
                    <span>Are you sure you want to delete this car?</span>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--red)" }}
                      onClick={() => onDeleteCar(car.id)}
                    >
                      YES
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: "var(--blue)" }}
                      onClick={() => setDeleteId(null)}
                    >
                      NO
                    </Button>
                  </div>
                ) : (
                  <span className="car-name" onClick={() => onCarClick(car.id)}>
                    {car.name}
                  </span>
                )}
              </td>

              {index === 0 && (
                <td className="finish-line" rowSpan={cars.length}>
                  FINISH
                </td>
              )}

              <td className="finish-zone"></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Garage;
