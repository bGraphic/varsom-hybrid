import { Component, Input } from "@angular/core";
import { Warning, WarningType } from "../../store/models/Warning";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";

enum Type {
  RainFall = 10,
  Wind = 20,
  WindDirection = 30,
  Temperature = 40,
  ZeroIsoterm = 50
}

enum SubType {
  WindStrength = 20,
  TemperatureFrom = 30,
  TemperatureTo = 40,
  WindDirection = 50,
  RainFallTo = 60,
  RainFallFrom = 70,
  Masl = 90,
  BeginTime = 100
}

interface MeasurementType {
  Id: number;
  Name: string;
  SortOrder: number;
  MeasurementSubTypes: {
    Id: number;
    Name: string;
    SortOrder: number;
    Value: string;
  }[];
}

interface Weather {
  MeasurementTypes: MeasurementType[];
  Comment?: string;
  CloudCoverName?: string;
}

@Component({
  selector: "mountain-weather",
  templateUrl: "mountain-weather.html"
})
export class MountainWeather {
  @Input() warning: Warning;
  descriptions: string[];

  constructor(private _translateService: TranslateService) {}

  ngOnChanges() {
    console.log("weather", this.warning.meta.MountainWeather);

    const weather = this.warning.meta.MountainWeather;

    if (!weather) {
      this.descriptions = [];
    } else {
      const measurementTypes = weather.MeasurementTypes;
      const measurmentIds = measurementTypes
        // Filter out WindDirection as it is added to Direction
        .filter(type => type.Id !== Type.WindDirection)
        // Filter out those with no SubTypes
        .filter(
          type =>
            !!type.MeasurementSubTypes && type.MeasurementSubTypes.length > 0
        )
        // Sort according to sort order
        .sort((a, b) => (a.SortOrder > b.SortOrder ? 1 : -1))
        // Resurn only ids
        .map(type => type.Id);

      this.descriptions = measurmentIds
        .map(id =>
          this._transformToStringDescription(
            id,
            measurementTypes,
            this.warning.date
          )
        )
        // Filter out null descriptions
        .filter(description => !!description);

      if (weather.CloudCoverName) {
        this.descriptions.push(
          `<strong>${this._translateService.instant("CLOUD_COVER")}:</strong> ${
            weather.CloudCoverName
          }`
        );
      }

      if (weather.Comment) {
        this.descriptions.push(weather.Comment);
      }
    }
  }

  _transformToStringDescription(
    id: Type,
    measurementTypes: MeasurementType[],
    date: Date
  ): string {
    const descriptionMap = descriptionFactory[id](measurementTypes);
    if (!descriptionMap) return null;

    let { labelKey, descriptionKey, descriptionValues } = descriptionMap;

    if (descriptionValues.direction1) {
      descriptionValues.direction1 = this._translateService.instant(
        `DIRECTION.${descriptionValues.direction1}`
      );
    }

    if (descriptionValues.direction2) {
      descriptionValues.direction2 = this._translateService.instant(
        `DIRECTION.${descriptionValues.direction2}`
      );
    }

    if (descriptionValues.beginTime) {
      descriptionValues.beginTime = this._translateService.instant(
        `TIME.${descriptionValues.beginTime}`,
        {
          dayOfWeek: moment(date)
            .format("dddd")
            .toLowerCase()
        }
      );
    }

    const label = labelKey ? this._translateService.instant(labelKey) : "";
    const description = descriptionKey
      ? this._translateService.instant(descriptionKey, descriptionValues)
      : "";

    return `<strong>${label}:</strong> ${description}`;
  }
}

const descriptionFactory = {
  [Type.RainFall]: (
    measurementTypes: MeasurementType[]
  ): { labelKey: string; descriptionKey: string; descriptionValues: any } => {
    const type = findType(measurementTypes, Type.RainFall);
    const from = parseInt(subTypeValue(type, SubType.RainFallFrom));
    const to = parseInt(subTypeValue(type, SubType.RainFallTo));

    let key = "RAINFALL.LONG";
    if (from === 0 && to === 0) {
      key = "RAINFALL.NONE";
    } else if (to - from < 5) {
      key = "RAINFALL.SHORT";
    }

    return {
      labelKey: type.Name,
      descriptionKey: key,
      descriptionValues: { from, to }
    };
  },
  [Type.Wind]: (measurementTypes: MeasurementType[]) => {
    const type1 = findType(measurementTypes, Type.Wind);
    const strength1 = subTypeValue(type1, SubType.WindStrength);
    const direction1 = subTypeValue(type1, SubType.WindDirection);

    if (!strength1) return null;

    let key = "WIND.LONG";
    if (!direction1) {
      key = "WIND.SHORT";
    }

    const type2 = findType(measurementTypes, Type.WindDirection);
    const strength2 = subTypeValue(type2, SubType.WindStrength);
    const direction2 = subTypeValue(type2, SubType.WindDirection);
    const beginTime = subTypeValue(type2, SubType.BeginTime);

    if (strength2 && direction2 && beginTime) {
      key = "WIND.CHANGE_LONG";
    } else if (strength2 && direction2) {
      key = "WIND.CHANGE_SHORT";
    }

    return {
      labelKey: type1.Name,
      descriptionKey: key,
      descriptionValues: {
        strength1,
        direction1,
        strength2: strength2 ? strength2.toLocaleLowerCase() : strength2,
        direction2,
        beginTime
      }
    };
  },
  [Type.Temperature]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.Temperature);
    const from = subTypeValue(type, SubType.TemperatureFrom);
    const to = subTypeValue(type, SubType.TemperatureTo);
    const masl = subTypeValue(type, SubType.Masl);

    if (!from || !to) return null;

    let key = "TEMPERATURE.LONG";
    if (!masl) {
      key = "TEMPERATURE.SHORT";
    }

    return {
      labelKey: type.Name,
      descriptionKey: key,
      descriptionValues: {
        from,
        to,
        masl
      }
    };
  },
  [Type.ZeroIsoterm]: (measurementTypes: MeasurementType[]) => {
    const type = findType(measurementTypes, Type.ZeroIsoterm);
    const masl = subTypeValue(type, SubType.Masl);
    const beginTime = subTypeValue(type, SubType.BeginTime);

    if (!masl || masl === "0") return null;

    let key = "ZERO_ISOTERM.LONG";
    if (!beginTime) {
      key = "ZERO_ISOTERM.SHORT";
    }

    if (parseInt(masl) >= 2500 && beginTime) {
      key = "ZERO_ISOTERM.TOP";
    }

    return {
      labelKey: "ZERO_ISOTERM.LABEL",
      descriptionKey: key,
      descriptionValues: {
        masl: masl,
        beginTime
      }
    };
  }
};

const findType = (measurementTypes: MeasurementType[], typeId: number) => {
  return measurementTypes.find(type => type.Id === typeId);
};

const subTypeValue = (type: MeasurementType, subTypeId: SubType): string => {
  const subType = type.MeasurementSubTypes.find(
    subType => subType.Id == subTypeId
  );

  if (subType) {
    return subType.Value;
  }
};
